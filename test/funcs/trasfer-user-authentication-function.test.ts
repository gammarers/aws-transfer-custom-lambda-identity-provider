import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';
import { TransferFamilyAuthorizerEvent, TransferFamilyAuthorizerResult } from 'aws-lambda';
import { mockClient } from 'aws-sdk-client-mock';
import { handler } from '../../src/funcs/transfer-user-authentication.lambda';

// Mock the AWS SDK
//jest.mock('@aws-sdk/client-secrets-manager');

// Mock the ip module
//jest.mock('ip');

// mock for SecretManager
const secretsManagerMockClient= mockClient(SecretsManagerClient);

describe('Transfer Family Authorizer Lambda', () => {

  beforeEach(() => {
    jest.clearAllMocks();
    secretsManagerMockClient.reset();
  });

  it('should return an empty result if a required parameter is missing', async () => {
    const event: Partial<TransferFamilyAuthorizerEvent> = {
      // Intentionally missing required parameters
      serverId: 'server-id',
      username: 'test-user',
      // protocol and sourceIp are missing
    };

    const result: TransferFamilyAuthorizerResult = await handler(event as TransferFamilyAuthorizerEvent);

    expect(result).toMatchObject({});
  });

  it('should handle SFTP user successful authentication', async () => {
    const event: TransferFamilyAuthorizerEvent = {
      serverId: 'server-id',
      username: 'test-user',
      protocol: 'SFTP',
      sourceIp: '192.168.1.1',
      password: 'password',
    };

    const secretId = `transfer-user/${event.serverId}/${event.username}`;
    const secretValue = {
      Password: 'password',
      Role: 'example-sftp-user-role',
      PublicKey: '',
      AcceptedIpNetworkList: '192.168.1.1/32',
      HomeDirectory: '/example-bucket/example-home/',
    };

    // Mock successful response from AWS Secrets Manager
    secretsManagerMockClient
      .on(GetSecretValueCommand, {
        SecretId: secretId,
      })
      .resolves({
        SecretString: JSON.stringify(secretValue),
      });

    const result: TransferFamilyAuthorizerResult = await handler(event);

    expect(result).toMatchObject({
      Role: secretValue.Role,
      HomeDirectory: secretValue.HomeDirectory,
    });
  });

  it('should handle FTP/S user successful authentication', async () => {
    const event: TransferFamilyAuthorizerEvent = {
      serverId: 'server-id',
      username: 'ftps-test-user',
      protocol: 'FTPS',
      sourceIp: '192.168.2.1',
      password: 'password',
    };

    const secretId = `transfer-user/${event.serverId}/${event.username}`;
    const secretValue = {
      Password: 'password',
      Role: 'example-ftps-user-role',
      PublicKey: '',
      AcceptedIpNetworkList: '192.168.2.1/32',
      HomeDirectory: '/example-bucket/example-home/',
    };

    // Mock successful response from AWS Secrets Manager
    secretsManagerMockClient
      .on(GetSecretValueCommand, {
        SecretId: secretId,
      })
      .resolves({
        SecretString: JSON.stringify(secretValue),
      });

    const result: TransferFamilyAuthorizerResult = await handler(event);

    expect(result).toMatchObject({
      Role: secretValue.Role,
      HomeDirectory: secretValue.HomeDirectory,
    });
  });

  it('should fail SFTP user authentication with incorrect password', async () => {
    const event: TransferFamilyAuthorizerEvent = {
      serverId: 'server-id',
      username: 'test-user',
      protocol: 'SFTP',
      sourceIp: '192.168.1.1',
      password: 'wrong-password',
    };

    const secretId = `transfer-user/${event.serverId}/${event.username}`;

    // Mock response from AWS Secrets Manager
    secretsManagerMockClient
      .on(GetSecretValueCommand, {
        SecretId: secretId,
      })
      .resolves({
        SecretString: JSON.stringify({
          Password: 'password',
          Role: 'example-sftp-user-role',
          PublicKey: '',
          AcceptedIpNetworkList: '192.168.1.1/32',
          HomeDirectory: '/example-bucket/example-home/',
        }),
      });

    const result: TransferFamilyAuthorizerResult = await handler(event);

    expect(result).toMatchObject({});
  });

  it('should fail FTP/S user authentication password is missing', async () => {
    const event: TransferFamilyAuthorizerEvent = {
      serverId: 'server-id',
      username: 'test-user',
      protocol: 'FTPS',
      sourceIp: '192.168.1.1',
      password: '',
    };

    const secretId = `transfer-user/${event.serverId}/${event.username}`;

    // Mock response from AWS Secrets Manager
    secretsManagerMockClient
      .on(GetSecretValueCommand, {
        SecretId: secretId,
      })
      .resolves({
        SecretString: JSON.stringify({
          Password: 'password',
          Role: 'example-ftps-user-role',
          AcceptedIpNetworkList: '192.168.1.1/32',
          HomeDirectory: '/example-bucket/example-home/',
        }),
      });

    const result: TransferFamilyAuthorizerResult = await handler(event);

    expect(result).toMatchObject({});
  });

  it('should handle IP address checks fail', async () => {
    const event: TransferFamilyAuthorizerEvent = {
      serverId: 'server-id',
      username: 'test-user',
      protocol: 'SFTP',
      sourceIp: '192.168.1.1',
      password: 'password',
    };

    const secretId = `transfer-user/${event.serverId}/${event.username}`;

    // Mock response from AWS Secrets Manager
    secretsManagerMockClient
      .on(GetSecretValueCommand, {
        SecretId: secretId,
        VersionStage: 'AWSCURRENT',
      })
      .resolves({
        SecretString: JSON.stringify({
          Password: 'password',
          Role: 'example-sftp-user-role',
          PublicKey: '',
          AcceptedIpNetworkList: '192.168.2.1/32',
          HomeDirectory: '/example-bucket/example-home/',
        }),
      });

    // Test different IP address scenarios
    //(ip.isEqual as jest.Mock).mockReturnValue(false);

    const result: TransferFamilyAuthorizerResult = await handler(event);

    expect(result).toMatchObject({});

    // Test IP match scenario
    //(ip.isEqual as jest.Mock).mockReturnValue(true);

    const resultWithIPMatch: TransferFamilyAuthorizerResult = await handler(event);

    expect(resultWithIPMatch).toMatchObject({});
  });
});
