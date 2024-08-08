import { Stack } from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';
import { TransferUserAuthenticationFunction } from './funcs/transfer-user-authentication-function';

//export interface TransferCustomLambdaIdentityProviderProps {}

export class TransferCustomLambdaIdentityProvider extends Construct {

  //constructor(scope: Construct, id: string, props?: TransferCustomLambdaIdentityProviderProps) {
  constructor(scope: Construct, id: string) {
    const account = Stack.of(scope).account;
    const region = Stack.of(scope).region;
    super(scope, id);

    const func = new TransferUserAuthenticationFunction(this, 'TransferUserAuthenticationFunction', {
      description: 'A function to lookup and return user data from AWS Secrets Manager.',
      role: new iam.Role(scope, 'TransferCustomLambdaIdentityProviderFunctionRole', {
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
      }),
    });
    func.addPermission('LambdaAccessPermission', {
      principal: new iam.ServicePrincipal('transfer.amazonaws.com'),
    });
  }
}
