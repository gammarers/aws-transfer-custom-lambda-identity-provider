# Transfer Custom Lambda Identity Provider

This is a Simple Transfer AWS CDK Construct

# Install

### TypeScript

```shell
npm install @yicr/transfer-custom-lambda-identity-provider
```
or
```shell
yarn add @yicr/transfer-custom-lambda-identity-provider
```

## Example

```shell
npm install @yicr/transfer-custom-lambda-identity-provider
```

```typescript
import { TransferCustomLambdaIdentityProvider } from '@yicr/transfer-custom-lambda-identity-provider';

new TransferCustomLambdaIdentityProvider(stack, 'TransferCustomLambdaIdentityProvider', {
  customHostname: 'sftp.example.com',
  route53HostedZoneId: 'Z0000000000000000000Q',
});

```
