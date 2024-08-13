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

  it('should handle SFTP user successful password authentication (return role)', async () => {
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
      AcceptedIpNetworks: '192.168.1.1/32',
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

    expect(result).toEqual({
      Role: secretValue.Role,
      HomeDirectory: secretValue.HomeDirectory,
    });
  });

  it('should handle SFTP user successful password authentication (return with policy)', async () => {
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
      Policy: 'example-sftp-user-role',
      AcceptedIpNetworks: '192.168.1.1/32',
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

    expect(result).toEqual({
      Policy: secretValue.Policy,
      Role: '',
      HomeDirectory: secretValue.HomeDirectory,
    });
  });

  it('should handle SFTP user successful ssh public key authentication', async () => {
    const event: TransferFamilyAuthorizerEvent = {
      serverId: 'server-id',
      username: 'test-pubkey-user',
      protocol: 'SFTP',
      sourceIp: '192.168.1.1',
      password: '',
    };

    const secretId = `transfer-user/${event.serverId}/${event.username}`;
    const secretValue = {
      Role: 'example-sftp-pub-key-user-role',
      PublicKey: 'ssh-rsa AAAAB3NzaC1yc2EAAAABIwAAAQEAtl5t6sPp5v2iO8TXZ3fPRhQsUOPlR5P7EshyRz5aGv2OUdbWjG1rU5NkBr5YZ5X73vQiUk4PS5ukUb4yF1VRliI3zRMnEBHkQ2PEhT1B7KzSO2m0H9KyYIF9Kg7UGyPU9Km/6ti+uYmCZ9Z+J7Op+bl4WSO/JZ47aE6ZPtN2t1D5x+JZQ8Wz2YF8bhhDZ2rJ0XbSZZIIRn3dBSfx5Q1BxlUN5RjLh9X2Izq9SP1r2vTuIhF/mf1McOthd4kMAvs9qqNmL9XknO9u8xSpG2yXSUzUblpI9bZWAG7QFhy8N6DJrKU3Z8MIvFQ8UlEYZm2N1vVHgSESHuO7A3mK45djkffIvE8F8w== test@localhost',
      AcceptedIpNetworks: '192.168.1.1/32',
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

    expect(result).toEqual({
      Role: secretValue.Role,
      HomeDirectory: secretValue.HomeDirectory,
      PublicKeys: [secretValue.PublicKey],
    });
  });

  it('should handle SFTP user successful ssh public key authentication (define by protocol)', async () => {
    const event: TransferFamilyAuthorizerEvent = {
      serverId: 'server-id',
      username: 'test-pubkey-user',
      protocol: 'SFTP',
      sourceIp: '192.168.1.1',
      password: '',
    };

    const secretId = `transfer-user/${event.serverId}/${event.username}`;
    const secretValue = {
      Role: 'example-sftp-pub-key-user-role',
      SFTPPublicKey: 'ssh-rsa AAAAB3NzaC1yc2EAAAABIwAAAQEAtl5t6sPp5v2iO8TXZ3fPRhQsUOPlR5P7EshyRz5aGv2OUdbWjG1rU5NkBr5YZ5X73vQiUk4PS5ukUb4yF1VRliI3zRMnEBHkQ2PEhT1B7KzSO2m0H9KyYIF9Kg7UGyPU9Km/6ti+uYmCZ9Z+J7Op+bl4WSO/JZ47aE6ZPtN2t1D5x+JZQ8Wz2YF8bhhDZ2rJ0XbSZZIIRn3dBSfx5Q1BxlUN5RjLh9X2Izq9SP1r2vTuIhF/mf1McOthd4kMAvs9qqNmL9XknO9u8xSpG2yXSUzUblpI9bZWAG7QFhy8N6DJrKU3Z8MIvFQ8UlEYZm2N1vVHgSESHuO7A3mK45djkffIvE8F8w== test@localhost',
      AcceptedIpNetworks: '192.168.1.1/32',
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

    expect(result).toEqual({
      Role: secretValue.Role,
      HomeDirectory: secretValue.HomeDirectory,
      PublicKeys: [secretValue.SFTPPublicKey],
    });
  });

  it('should fail SFTP user ssh public key authentication(not stored public key)', async () => {
    const event: TransferFamilyAuthorizerEvent = {
      serverId: 'server-id',
      username: 'test-pubkey-user',
      protocol: 'SFTP',
      sourceIp: '192.168.1.1',
      password: '',
    };

    const secretId = `transfer-user/${event.serverId}/${event.username}`;
    const secretValue = {
      Password: 'password',
      Role: 'example-sftp-pub-key-user-role',
      AcceptedIpNetworks: '192.168.1.1/32',
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

    expect(result).toEqual({});
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
      AcceptedIpNetworks: '192.168.2.1/32',
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

    expect(result).toEqual({
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
          AcceptedIpNetworks: '192.168.1.1/32',
          HomeDirectory: '/example-bucket/example-home/',
        }),
      });

    const result: TransferFamilyAuthorizerResult = await handler(event);

    expect(result).toEqual({});
  });

  it('should fail SFTP user authentication with no stored password', async () => {
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
      })
      .resolves({
        SecretString: JSON.stringify({
          Role: 'example-sftp-user-role',
          AcceptedIpNetworks: '192.168.1.1/32',
          HomeDirectory: '/example-bucket/example-home/',
        }),
      });

    const result: TransferFamilyAuthorizerResult = await handler(event);

    expect(result).toEqual({});
  });

  it('should fail SFTP user authentication with empty stored role', async () => {
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
      Role: '',
      AcceptedIpNetworks: '192.168.1.1/32',
      HomeDirectory: '/example-bucket/example-home/',
    };

    // Mock response from AWS Secrets Manager
    secretsManagerMockClient
      .on(GetSecretValueCommand, {
        SecretId: secretId,
      })
      .resolves({
        SecretString: JSON.stringify(secretValue),
      });

    const result: TransferFamilyAuthorizerResult = await handler(event);

    expect(result).toEqual({
      Role: secretValue.Role,
      HomeDirectory: secretValue.HomeDirectory,
    });
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
          AcceptedIpNetworks: '192.168.1.1/32',
          HomeDirectory: '/example-bucket/example-home/',
        }),
      });

    const result: TransferFamilyAuthorizerResult = await handler(event);

    expect(result).toEqual({});
  });

  it('should fail IP address range', async () => {
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
      })
      .resolves({
        SecretString: JSON.stringify({
          Password: 'password',
          Role: 'example-sftp-user-role',
          PublicKey: '',
          AcceptedIpNetworks: '192.168.2.1/32',
          HomeDirectory: '/example-bucket/example-home/',
        }),
      });

    const result: TransferFamilyAuthorizerResult = await handler(event);

    expect(result).toEqual({});
  });

  it('should fail IP address not stored', async () => {
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
      })
      .resolves({
        SecretString: JSON.stringify({
          Password: 'password',
          Role: 'example-sftp-user-role',
          PublicKey: '',
          HomeDirectory: '/example-bucket/example-home/',
        }),
      });

    const result: TransferFamilyAuthorizerResult = await handler(event);

    expect(result).toEqual({});
  });

  it('should handle secret manager resource empty', async () => {

    const event: TransferFamilyAuthorizerEvent = {
      serverId: 'server-id',
      username: 'test-user',
      protocol: 'SFTP',
      sourceIp: '192.168.1.1',
      password: 'password',
    };

    secretsManagerMockClient
      .on(GetSecretValueCommand, {
        SecretId: 'empty-secret',
      })
      .resolves({
        SecretString: JSON.stringify({}),
      });

    const result: TransferFamilyAuthorizerResult = await handler(event);

    expect(result).toEqual({});
  });

  //  it('should handle secret manager resource not found', async () => {
  //
  //    const event: TransferFamilyAuthorizerEvent = {
  //      serverId: 'server-id',
  //      username: 'test-user',
  //      protocol: 'SFTP',
  //      sourceIp: '192.168.1.1',
  //      password: 'password',
  //    };
  //
  //    secretsManagerMockClient
  //      .on(GetSecretValueCommand, {
  //        SecretId: 'not-found-secret',
  //      })
  //      .rejects(new ResourceNotFoundException({
  //        message: "Secrets Manager can't find the specified secret.",
  //        name: 'ResourceNotFoundException',
  //      }));
  //
  //    const result: TransferFamilyAuthorizerResult = await handler(event);
  //
  //    expect(result).toEqual({});
  //  });
});
