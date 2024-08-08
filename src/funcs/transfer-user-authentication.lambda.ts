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
    authenticationType = 'SSH';
  }

  const secret = await getSecret(`transfer-user/${inputServerId}/${inputUsername}`);

  if (secret) {
    const secretDict = JSON.parse(secret) as SecretDict;
    const userAuthenticated = authenticateUser(authenticationType, secretDict, inputPassword, inputProtocol);
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
  const acceptedIpNetworkList = lookup(secretDict, 'AcceptedIpNetworkList', inputProtocol);
  if (!acceptedIpNetworkList) {
    console.log('No IP range provided - Skip IP check');
    return true;
  }

  for (const acceptedIpNetwork of acceptedIpNetworkList.split(',')) {
    if (isIpInCidr(inputSourceIp, acceptedIpNetwork)) {
      console.log('Source IP address match');
      return true;
    }
  }
  //  if (new CIDRMatcher(acceptedIpNetworkList.split(',')).contains(inputSourceIp)) {
  //    console.log('Source IP address match');
  //    return true;
  //  }

  console.log('Source IP address not in range');
  return false;
};

const authenticateUser = (authType: string, secretDict: SecretDict, inputPassword: string, inputProtocol: string): boolean => {
  if (authType === 'SSH') {
    console.log('Skip password check as SSH login request');
    return true;
  } else {
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

  if (authType === 'SSH') {
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
  const command = new GetSecretValueCommand({ SecretId: id });

  try {
    const data: GetSecretValueCommandOutput = await client.send(command);
    console.log(data);
    if (data.SecretString) {
      return data.SecretString;
    }
    if (data.SecretBinary) {
      return new TextDecoder().decode(data.SecretBinary);
    }
    return null;
  } catch (error) {
    console.log('Not found Secret');
    console.log(`Error: ${JSON.stringify(error)}`);
    return null;
  }
  //const resp = await client.send(command);
//  return client.send(command)
//    .then((data: GetSecretValueCommandOutput) => {
//      if (data?.SecretString) {
//        return data.SecretString;
//      }
//      if (data?.SecretBinary) {
//        return new TextDecoder().decode(data.SecretBinary);
//      }
//      return null;
//    })
//    .catch((error: Error) => {
//      console.log('Not found Secret');
//      console.log(`Error:${JSON.stringify(error)}`);
//      return null;
//    });
//  console.log(resp);
//  if (resp.SecretString) {
//    console.log('Found Secret String');
//    return resp.SecretString;
//  } else {
//    if (resp.SecretBinary) {
//      console.log('Found Binary Secret');
//      //return Buffer.from(resp.SecretBinary as string, 'base64').toString('ascii');
//      return new TextDecoder().decode(resp.SecretBinary);
//    }
//  }
//
//  console.log('Not found Secret');
//  return null;
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

const getSubnetMask = (bits: number, isIPv6 = false) => {
  let mask = BigInt(0);
  const totalBits = isIPv6 ? 128 : 32;
  for (let i = 0; i < bits; i++) {
    mask = mask * BigInt(2) + BigInt(1);
  }
  for (let i = bits; i < totalBits; i++) {
    mask = mask * BigInt(2);
  }
  return mask;
};

const isIpInCidr = (address: string, cidr: string) => {
  const [network, bits] = cidr.split('/');
  const isIPv6 = network.includes(':');
  const ipBigInt = ipToBigInt(address);
  const networkBigInt = ipToBigInt(network);
  const mask = getSubnetMask(parseInt(bits), isIPv6);

  const maskedIp = ipBigInt - (ipBigInt % (mask + BigInt(1)));
  const maskedNetwork = networkBigInt - (networkBigInt % (mask + BigInt(1)));

  return maskedIp === maskedNetwork;
};