const { awscdk } = require('projen');
const project = new awscdk.AwsCdkConstructLibrary({
  author: 'yicr',
  authorAddress: 'yicr@users.noreply.github.com',
  cdkVersion: '2.61.0',
  defaultReleaseBranch: 'main',
  name: 'transfer-custom-lambda-identity-provider',
  repositoryUrl: 'https://github.com/yicr/transfer-custom-lambda-identity-provider.git',
  keywords: ['aws', 'cdk', 'aws-cdk', 'transfer', 'sftp'],
  deps: [],
  // description: undefined,  /* The description is just a string that helps people understand the purpose of the package. */
  devDeps: [],
  // packageName: undefined,  /* The "name" in package.json. */
});
project.synth();