import { SecretsManagerClient, GetSecretValueCommand, GetSecretValueCommandOutput } from '@aws-sdk/client-secrets-manager';
import { TransferFamilyAuthorizerEvent, TransferFamilyAuthorizerResult } from 'aws-lambda';

interface SecretDict {
  [key: string]: string;
}

export const handler = async (event: TransferFamilyAuthorizerEvent): Promise<TransferFamilyAuthorizerResult> => {
  const requiredParamList = ['serverId', 'username', 'protocol', 'sourceIp'];
  for (const parameter of requiredParamList) {
    if (!event.hasOwnProperty(parameter)) {
      console.log(`Incoming ${parameter} missing - Unexpected`);
      return {};
    }
  }

  const inputServerId = event.serverId;
  const inputUsername = event.username;
  const inputProtocol = event.protocol;
  const inputSourceIp = event.sourceIp;
  const inputPassword = event.password || '';

  console.log(`ServerId: ${inputServerId}, Username: ${inputUsername}, Protocol: ${inputProtocol}, SourceIp: ${inputSourceIp}`);

  console.log('Start User Authentication Flow');
  let authenticationType = '';
  if (inputPassword !== '') {
    console.log('Using PASSWORD authentication');
    authenticationType = 'PASSWORD';
  } else {
    if (inputProtocol === 'FTP' || inputProtocol === 'FTPS') {
      console.log('Empty password not allowed for FTP/S');
      return {};
    }
    console.log('Using SSH authentication');
    authenticationType = 'SSHPubKey';
  }

  const secret = await getSecret(`transfer-user/${inputServerId}/${inputUsername}`);

  if (secret) {
    const secretDict = JSON.parse(secret) as SecretDict;
    const userAuthenticated = (() => {
      if (authenticationType === 'SSHPubKey') {
        console.log('Skip password check as SSH login request');
        return true;
      }
      return authenticatePasswordUser(secretDict, inputPassword, inputProtocol);
    })();
    const ipMatch = checkIpAddress(secretDict, inputSourceIp, inputProtocol);

    if (userAuthenticated && ipMatch) {
      console.log(`User authenticated, calling buildResponse with: ${authenticationType}`);
      return buildResponse(secretDict, authenticationType, inputProtocol);
    } else {
      console.log('User failed authentication return empty response');
      return {};
    }
  } else {
    console.log('Secrets Manager exception thrown - Returning empty response');
    return {};
  }
};

const lookup = (secretDict: SecretDict, key: string, inputProtocol: string): string | null => {
  if (secretDict[`${inputProtocol}${key}`]) {
    console.log(`Found protocol-specified ${key}`);
    return secretDict[`${inputProtocol}${key}`];
  } else {
    return secretDict[key] || null;
  }
};

const checkIpAddress = (secretDict: SecretDict, inputSourceIp: string, inputProtocol: string): boolean => {
  const acceptedIpNetworks = lookup(secretDict, 'AcceptedIpNetworks', inputProtocol);
  console.log(`AcceptedIpNetworks: ${acceptedIpNetworks}`);
  if (!acceptedIpNetworks) {
    console.log('Unable to authenticate user - No filed match in Secret for AcceptedIpNetworks(CIDR format, comma-separated)');
    return false;
  }

  for (const cidr of acceptedIpNetworks.split(',')) {
    if (isIpInCidr(inputSourceIp, cidr)) {
      console.log('Source IP address match');
      return true;
    }
  }

  console.log('Source IP address not in range');
  return false;
};

const authenticatePasswordUser = (secretDict: SecretDict, inputPassword: string, inputProtocol: string): boolean => {
  const password = lookup(secretDict, 'Password', inputProtocol);
  if (!password) {
    console.log('Unable to authenticate user - No field match in Secret for password');
    return false;
  }

  if (inputPassword === password) {
    return true;
  } else {
    console.log('Unable to authenticate user - Incoming password does not match stored');
    return false;
  }
};

const buildResponse = (secretDict: SecretDict, authType: string, inputProtocol: string): TransferFamilyAuthorizerResult => {
  const responseData: TransferFamilyAuthorizerResult = {};

  const role = lookup(secretDict, 'Role', inputProtocol);
  if (role) {
    responseData.Role = role;
  } else {
    console.log('No field match for role - Set empty string in response');
    responseData.Role = '';
  }

  const policy = lookup(secretDict, 'Policy', inputProtocol);
  if (policy) {
    responseData.Policy = policy;
  }

  const homeDirectoryDetails = lookup(secretDict, 'HomeDirectoryDetails', inputProtocol);
  if (homeDirectoryDetails) {
    console.log('HomeDirectoryDetails found - Applying setting for virtual folders - Note: Cannot be used in conjunction with key: HomeDirectory');
    responseData.HomeDirectoryDetails = homeDirectoryDetails;
    console.log('Setting HomeDirectoryType to LOGICAL');
    responseData.HomeDirectoryType = 'LOGICAL';
  }

  const homeDirectory = lookup(secretDict, 'HomeDirectory', inputProtocol);
  if (homeDirectory) {
    console.log('HomeDirectory found - Note: Cannot be used in conjunction with key: HomeDirectoryDetails');
    responseData.HomeDirectory = homeDirectory;
  }

  if (authType === 'SSHPubKey') {
    const publicKey = lookup(secretDict, 'PublicKey', inputProtocol);
    if (publicKey) {
      responseData.PublicKeys = [publicKey];
    } else {
      console.log('Unable to authenticate user - No public keys found');
      return {};
    }
  }

  return responseData;
};

const getSecret = async (id: string): Promise<string | null> => {
  console.log(`Secret Name: ${id}`);

  const client = new SecretsManagerClient({
    region: 'ap-northeast-1',
  });

  //  try {
  //    const data: GetSecretValueCommandOutput = await client.send(command);
  //    if (data.SecretString) {
  //      return data.SecretString;
  //    }
  //    if (data.SecretBinary) {
  //      return Buffer.from(data.SecretBinary).toString('utf-8');
  //    }
  //    return null;
  //  } catch (error) {
  //    console.log('Not found Secret');
  //    console.log(`Error: ${JSON.stringify(error)}`);
  //    return null;
  //  }
  return client.send(new GetSecretValueCommand({ SecretId: id }))
    .then((data: GetSecretValueCommandOutput) => {
      if (data?.SecretBinary) {
        return Buffer.from(data.SecretBinary).toString('utf-8');
      }
      return data?.SecretString ? data.SecretString: null;
    })
    .catch((error: Error) => {
      console.log('Not found Secret');
      console.log(`Error:${JSON.stringify(error)}`);
      return null;
    });
};

const ipToBigInt = (address: string) => {
  if (address.includes(':')) {
    // IPv6
    let parts = address.split(':').map(part => part === '' ? '0' : part);
    let bigInt = BigInt(0);
    for (let i = 0; i < parts.length; i++) {
      bigInt = bigInt * BigInt(0x10000) + BigInt(parseInt(parts[i], 16));
    }
    return bigInt;
  } else {
    // IPv4
    let parts = address.split('.').map(part => parseInt(part, 10));
    let bigInt = BigInt(0);
    for (let i = 0; i < parts.length; i++) {
      bigInt = bigInt * BigInt(256) + BigInt(parts[i]);
    }
    return bigInt;
  }
};

const getSubnetRange = (cidr: string): { start: bigint; end: bigint } => {
  const [network, bits] = cidr.split('/');
  const isIPv6 = network.includes(':');
  const totalBits = isIPv6 ? 128 : 32;
  const networkBigInt = ipToBigInt(network);
  const hostBits = totalBits - parseInt(bits, 10);
  const subnetSize = BigInt(2) ** BigInt(hostBits);

  const start = networkBigInt - (networkBigInt % subnetSize);
  const end = start + subnetSize - BigInt(1);

  return { start, end };
};

const isIpInCidr = (ipAddr: string, cidr: string) => {
  const ipBigInt = ipToBigInt(ipAddr);
  const { start, end } = getSubnetRange(cidr);
  return ipBigInt >= start && ipBigInt <= end;
};