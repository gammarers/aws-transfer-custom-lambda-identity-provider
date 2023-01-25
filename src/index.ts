import * as path from 'path';
import * as cdk from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as transfer from 'aws-cdk-lib/aws-transfer';
import { Construct } from 'constructs';
import crc from 'crc';

export interface TransferCustomLambdaIdentityProviderProps {
  readonly customHostname?: string;
  readonly route53HostedZoneId?: string;
}

export class TransferCustomLambdaIdentityProvider extends Construct {

  constructor(scope: Construct, id: string, props: TransferCustomLambdaIdentityProviderProps) {
    super(scope, id);

    const account = cdk.Stack.of(this).account;
    const region = cdk.Stack.of(this).region;

    const nameSuffix = crc.crc32(cdk.Names.uniqueId(this)).toString(16);

    // 👇Create Lambda Execution role.
    const lambdaExecutionRole = new iam.Role(this, 'LambdaExecutionRole', {
      roleName: `lambda-exec-role-${nameSuffix}`,
      description: '',
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole'),
      ],
      inlinePolicies: {
        ['get-secret-policy']: new iam.PolicyDocument({
          statements: [
            new iam.PolicyStatement({
              effect: iam.Effect.ALLOW,
              actions: [
                'secretsmanager:GetSecretValue',
              ],
              resources: [
                `arn:aws:secretsmanager:${region}:${account}:secret:transfer/s-*`,
              ],
            }),
          ],
        }),
      },
    });

    // 👇Create Lambda function.
    const lambdaFunction = new lambda.Function(this, 'Function', {
      functionName: `sftp-user-authentication-func-${nameSuffix}`,
      description: 'A function to lookup and return user data from AWS Secrets Manager.',
      runtime: lambda.Runtime.PYTHON_3_8,
      code: lambda.Code.fromAsset(path.join(__dirname, '../asset/sftp-user-authentication-func')),
      handler: 'index.lambda_handler',
      role: lambdaExecutionRole,
    });
    lambdaFunction.addPermission('LambdaAccessPermission', {
      principal: new iam.ServicePrincipal('transfer.amazonaws.com'),
    });

    // 👇Create Transfer Logging role.
    const loggingRole = new iam.Role(this, 'LoggingRole', {
      roleName: `transfer-logging-role-${nameSuffix}`,
      description: 'transfer logging role.',
      assumedBy: new iam.ServicePrincipal('transfer.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSTransferLoggingAccess'),
      ],
    });

    // 👇Create Transfer Server.
    const transferServer = new transfer.CfnServer(this, 'TransferServer', {
      protocols: ['SFTP'],
      endpointType: 'PUBLIC',
      identityProviderType: 'AWS_LAMBDA',
      identityProviderDetails: {
        function: lambdaFunction.functionArn,
      },
      loggingRole: loggingRole.roleArn,
    });
    if (props.customHostname) {
      cdk.Tags.of(transferServer).add('aws:transfer:customHostname', props.customHostname);
      if (props.route53HostedZoneId) {
        cdk.Tags.of(transferServer).add('aws:transfer:route53HostedZoneId', props.route53HostedZoneId);
      }
    } else {
      if (props.route53HostedZoneId) {
        throw new Error('Missing Custom Hostname. Is set HostZoneId, and set Route53 HostZoneId.');
      }
    }
  }
}
