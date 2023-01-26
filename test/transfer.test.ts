import { App, Stack } from 'aws-cdk-lib';
import { Match, Template } from 'aws-cdk-lib/assertions';
import { TransferCustomLambdaIdentityProvider } from '../src';

describe('TransferCustomLambdaIdentityProvider Testing', () => {

  const app = new App();
  const account = '123456789012';
  const stack = new Stack(app, 'TestingStack', {
    env: {
      account: account,
      region: 'us-east-1',
    },
  });
  new TransferCustomLambdaIdentityProvider(stack, 'TransferCustomLambdaIdentityProvider', {
    customHostname: 'sftp.example.com',
    route53HostedZoneId: 'Z0000000000000000000Q',
  });

  const template = Template.fromStack(stack);

  it('Should has Lambda execution role.', () => {
    template.hasResourceProperties('AWS::IAM::Role', {
      RoleName: Match.stringLikeRegexp('lambda-exec-role-'),
      AssumeRolePolicyDocument: Match.objectEquals({
        Version: '2012-10-17',
        Statement: Match.arrayWith([
          Match.objectEquals({
            Effect: 'Allow',
            Principal: {
              Service: 'lambda.amazonaws.com',
            },
            Action: 'sts:AssumeRole',
          }),
        ]),
      }),
      ManagedPolicyArns: Match.arrayWith([
        {
          'Fn::Join': Match.arrayEquals([
            '',
            Match.arrayEquals([
              'arn:',
              {
                Ref: 'AWS::Partition',
              },
              ':iam::aws:policy/service-role/AWSLambdaBasicExecutionRole',
            ]),
          ]),
        },
      ]),
    });
  });

  it('Should has Transfer logging role.', () => {
    template.hasResourceProperties('AWS::IAM::Role', {
      RoleName: Match.stringLikeRegexp('transfer-logging-role-'),
      AssumeRolePolicyDocument: Match.objectEquals({
        Version: '2012-10-17',
        Statement: Match.arrayWith([
          Match.objectEquals({
            Effect: 'Allow',
            Principal: {
              Service: 'transfer.amazonaws.com',
            },
            Action: 'sts:AssumeRole',
          }),
        ]),
      }),
      ManagedPolicyArns: Match.arrayWith([
        {
          'Fn::Join': Match.arrayEquals([
            '',
            Match.arrayEquals([
              'arn:',
              {
                Ref: 'AWS::Partition',
              },
              ':iam::aws:policy/service-role/AWSTransferLoggingAccess',
            ]),
          ]),
        },
      ]),
    });
  });

  it('Should match snapshot', () => {
    expect(template.toJSON()).toMatchSnapshot();
  });
});

describe('TransferCustomLambdaIdentityProvider Error Testing', () => {

  const app = new App();
  const account = '123456789012';

  it('Should throw error (invalid).', () => {
    const stack = new Stack(app, 'TestingStack', {
      env: {
        account: account,
        region: 'us-east-1',
      },
    });
    const transferWrapper = () => {
      new TransferCustomLambdaIdentityProvider(stack, 'TransferCustomLambdaIdentityProvider', {
        route53HostedZoneId: 'Z0000000000000000000Q',
      });
    };
    expect(transferWrapper).toThrowError(Error);
  });
});