# AWS Transfer Custom Lambda Identity Provider

[![GitHub](https://img.shields.io/github/license/gammarers/aws-transfer-custom-lambda-identity-provider?style=flat-square)](https://github.com/gammarers/aws-transfer-custom-lambda-identity-provider/blob/main/LICENSE)
[![npm (scoped)](https://img.shields.io/npm/v/@gammarers/aws-transfer-custom-lambda-identity-provider?style=flat-square)](https://www.npmjs.com/package/@gammarers/aws-transfer-custom-lambda-identity-provider)
[![GitHub Workflow Status (branch)](https://img.shields.io/github/actions/workflow/status/gammarers/aws-transfer-custom-lambda-identity-provider/release.yml?branch=main&label=release&style=flat-square)](https://github.com/gammarers/aws-transfer-custom-lambda-identity-provider/actions/workflows/release.yml)
[![GitHub release (latest SemVer)](https://img.shields.io/github/v/release/gammarers/aws-transfer-custom-lambda-identity-provider?sort=semver&style=flat-square)](https://github.com/gammarers/aws-transfer-custom-lambda-identity-provider/releases)

This is a Simple Transfer AWS CDK Construct

## Features

- [x] SFTP User password login (inclued ip restrict)
  - [x] testing implementetion
  - [ ] ested in an actual AWS environment
- [x] SFTP User password login (none ip restrict)
  - [ ] testing implementetion
  - [ ] ested in an actual AWS environment
- [x] SFTP User public key authentication login (inclued ip restrict)
  - [x] testing implementetion
  - [ ] ested in an actual AWS environment
- [x] SFTP User public key authentication login (none ip restrict)
  - [ ] testing implementetion
  - [ ] ested in an actual AWS environment
- [x] SFTP User's info from AWS SecretManager
  - [x] SecureString
    - [x] testing implementetion
    - [ ] ested in an actual AWS environment
  - [x] SecureBinary
    - [ ] testing implementetion
    - [ ] ested in an actual AWS environment
- [x] FTP/S User's password login (inclued ip restrict)
  - [x] testing implementetion
  - [ ] ested in an actual AWS environment
- [ ] HomeDirectoryDetails

### Other

- [ ] SecretManager layer
- [ ] Logging to JSON
- [ ] disable output log in projen test

## Architecture

diagram

## Install

### TypeScript

```shell
npm install @gammarers/transfer-custom-lambda-identity-provider
```
or
```shell
yarn add @gammarers/transfer-custom-lambda-identity-provider
```

## Example

```shell
npm install @gammarers/transfer-custom-lambda-identity-provider
```

```typescript
import { TransferCustomLambdaIdentityProvider } from '@gammarers/aws-transfer-custom-lambda-identity-provider';

new TransferCustomLambdaIdentityProvider(stack, 'TransferCustomLambdaIdentityProvider');

```
