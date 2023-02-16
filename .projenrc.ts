import { awscdk, javascript } from 'projen';

const project = new awscdk.AwsCdkConstructLibrary({
  author: 'yicr',
  authorAddress: 'yicr@users.noreply.github.com',
  cdkVersion: '2.61.0',
  projenrcTs: true,
  defaultReleaseBranch: 'main',
  name: '@yicr/transfer-custom-lambda-identity-provider',
  description: 'This is a Simple Transfer AWS CDK Construct',
  repositoryUrl: 'https://github.com/yicr/transfer-custom-lambda-identity-provider.git',
  keywords: ['aws', 'cdk', 'aws-cdk', 'transfer', 'sftp'],
  deps: [],
  devDeps: [
    '@yicr/jest-serializer-cdk-asset',
  ],
  jestOptions: {
    jestConfig: {
      snapshotSerializers: ['<rootDir>/node_modules/@yicr/jest-serializer-cdk-asset'],
    },
  },
  npmAccess: javascript.NpmAccess.PUBLIC,
  depsUpgradeOptions: {
    workflowOptions: {
      labels: ['auto-approve', 'auto-merge'],
      schedule: javascript.UpgradeDependenciesSchedule.expressions(['0 18 * * *']),
    },
  },
  autoApproveOptions: {
    secret: 'GITHUB_TOKEN',
    allowedUsernames: ['yicr'],
  },
});
project.synth();