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
    '@gammarer/jest-serializer-aws-cdk-asset-filename-replacer@~0.4',
  ],
  jestOptions: {
    jestConfig: {
      snapshotSerializers: ['<rootDir>/node_modules/@gammarer/jest-serializer-aws-cdk-asset-filename-replacer'],
    },
  },
  npmAccess: javascript.NpmAccess.PUBLIC,
  minNodeVersion: '16.0.0',
  workflowNodeVersion: '16.19.1',
  depsUpgradeOptions: {
    workflowOptions: {
      labels: ['auto-approve', 'auto-merge'],
      schedule: javascript.UpgradeDependenciesSchedule.expressions(['0 18 * * 6']),
    },
  },
  autoApproveOptions: {
    secret: 'GITHUB_TOKEN',
    allowedUsernames: ['yicr'],
  },
});
project.synth();