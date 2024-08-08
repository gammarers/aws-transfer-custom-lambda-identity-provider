import { awscdk, javascript } from 'projen';

const project = new awscdk.AwsCdkConstructLibrary({
  author: 'yicr',
  authorAddress: 'yicr@users.noreply.github.com',
  defaultReleaseBranch: 'main',
  cdkVersion: '2.80.0',
  typescriptVersion: '5.4.x',
  jsiiVersion: '5.4.x',
  projenrcTs: true,
  name: '@gammarers/aws-transfer-custom-lambda-identity-provider-function',
  description: 'This is a Simple Transfer AWS CDK Construct',
  repositoryUrl: 'https://github.com/gammarers/aws-transfer-custom-lambda-identity-provider-function.git',
  keywords: ['aws', 'cdk', 'aws-cdk', 'transfer', 'sftp'],
  deps: [
  ],
  devDeps: [
    'aws-sdk-client-mock@^3',
    'aws-sdk-client-mock-jest@^3',
    '@aws-sdk/client-secrets-manager@^3',
    '@types/aws-lambda@^8',
    '@gammarers/jest-aws-cdk-asset-filename-renamer@~0.5.4',
  ],
  jestOptions: {
    jestConfig: {
      snapshotSerializers: ['<rootDir>/node_modules/@gammarers/jest-aws-cdk-asset-filename-renamer'],
    },
  },
  tsconfigDev: {
    compilerOptions: {
      strict: true,
    },
  },
  npmAccess: javascript.NpmAccess.PUBLIC,
  minNodeVersion: '16.0.0',
  workflowNodeVersion: '22.x',
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
  lambdaOptions: {
    // target node.js runtime
    runtime: awscdk.LambdaRuntime.NODEJS_20_X,
    bundlingOptions: {
      // list of node modules to exclude from the bundle
      externals: ['@aws-sdk/client-secrets-manager'],
      sourcemap: true,
    },
  },
});


project.synth();