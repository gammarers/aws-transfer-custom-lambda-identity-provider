# API Reference <a name="API Reference" id="api-reference"></a>

## Constructs <a name="Constructs" id="Constructs"></a>

### TransferCustomLambdaIdentityProvider <a name="TransferCustomLambdaIdentityProvider" id="transfer-custom-lambda-identity-provider.TransferCustomLambdaIdentityProvider"></a>

#### Initializers <a name="Initializers" id="transfer-custom-lambda-identity-provider.TransferCustomLambdaIdentityProvider.Initializer"></a>

```typescript
import { TransferCustomLambdaIdentityProvider } from 'transfer-custom-lambda-identity-provider'

new TransferCustomLambdaIdentityProvider(scope: Construct, id: string, props: TransferCustomLambdaIdentityProviderProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#transfer-custom-lambda-identity-provider.TransferCustomLambdaIdentityProvider.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#transfer-custom-lambda-identity-provider.TransferCustomLambdaIdentityProvider.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#transfer-custom-lambda-identity-provider.TransferCustomLambdaIdentityProvider.Initializer.parameter.props">props</a></code> | <code><a href="#transfer-custom-lambda-identity-provider.TransferCustomLambdaIdentityProviderProps">TransferCustomLambdaIdentityProviderProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="transfer-custom-lambda-identity-provider.TransferCustomLambdaIdentityProvider.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="transfer-custom-lambda-identity-provider.TransferCustomLambdaIdentityProvider.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="transfer-custom-lambda-identity-provider.TransferCustomLambdaIdentityProvider.Initializer.parameter.props"></a>

- *Type:* <a href="#transfer-custom-lambda-identity-provider.TransferCustomLambdaIdentityProviderProps">TransferCustomLambdaIdentityProviderProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#transfer-custom-lambda-identity-provider.TransferCustomLambdaIdentityProvider.toString">toString</a></code> | Returns a string representation of this construct. |

---

##### `toString` <a name="toString" id="transfer-custom-lambda-identity-provider.TransferCustomLambdaIdentityProvider.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#transfer-custom-lambda-identity-provider.TransferCustomLambdaIdentityProvider.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="transfer-custom-lambda-identity-provider.TransferCustomLambdaIdentityProvider.isConstruct"></a>

```typescript
import { TransferCustomLambdaIdentityProvider } from 'transfer-custom-lambda-identity-provider'

TransferCustomLambdaIdentityProvider.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="transfer-custom-lambda-identity-provider.TransferCustomLambdaIdentityProvider.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#transfer-custom-lambda-identity-provider.TransferCustomLambdaIdentityProvider.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |

---

##### `node`<sup>Required</sup> <a name="node" id="transfer-custom-lambda-identity-provider.TransferCustomLambdaIdentityProvider.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---


## Structs <a name="Structs" id="Structs"></a>

### TransferCustomLambdaIdentityProviderProps <a name="TransferCustomLambdaIdentityProviderProps" id="transfer-custom-lambda-identity-provider.TransferCustomLambdaIdentityProviderProps"></a>

#### Initializer <a name="Initializer" id="transfer-custom-lambda-identity-provider.TransferCustomLambdaIdentityProviderProps.Initializer"></a>

```typescript
import { TransferCustomLambdaIdentityProviderProps } from 'transfer-custom-lambda-identity-provider'

const transferCustomLambdaIdentityProviderProps: TransferCustomLambdaIdentityProviderProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#transfer-custom-lambda-identity-provider.TransferCustomLambdaIdentityProviderProps.property.customHostname">customHostname</a></code> | <code>string</code> | *No description.* |
| <code><a href="#transfer-custom-lambda-identity-provider.TransferCustomLambdaIdentityProviderProps.property.route53HostedZoneId">route53HostedZoneId</a></code> | <code>string</code> | *No description.* |

---

##### `customHostname`<sup>Optional</sup> <a name="customHostname" id="transfer-custom-lambda-identity-provider.TransferCustomLambdaIdentityProviderProps.property.customHostname"></a>

```typescript
public readonly customHostname: string;
```

- *Type:* string

---

##### `route53HostedZoneId`<sup>Optional</sup> <a name="route53HostedZoneId" id="transfer-custom-lambda-identity-provider.TransferCustomLambdaIdentityProviderProps.property.route53HostedZoneId"></a>

```typescript
public readonly route53HostedZoneId: string;
```

- *Type:* string

---



