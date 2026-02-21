# API Reference <a name="API Reference" id="api-reference"></a>

## Constructs <a name="Constructs" id="Constructs"></a>

### TransferCustomLambdaIdentityProvider <a name="TransferCustomLambdaIdentityProvider" id="@gammarers/aws-transfer-custom-lambda-identity-provider.TransferCustomLambdaIdentityProvider"></a>

#### Initializers <a name="Initializers" id="@gammarers/aws-transfer-custom-lambda-identity-provider.TransferCustomLambdaIdentityProvider.Initializer"></a>

```typescript
import { TransferCustomLambdaIdentityProvider } from '@gammarers/aws-transfer-custom-lambda-identity-provider'

new TransferCustomLambdaIdentityProvider(scope: Construct, id: string)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@gammarers/aws-transfer-custom-lambda-identity-provider.TransferCustomLambdaIdentityProvider.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#@gammarers/aws-transfer-custom-lambda-identity-provider.TransferCustomLambdaIdentityProvider.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@gammarers/aws-transfer-custom-lambda-identity-provider.TransferCustomLambdaIdentityProvider.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="@gammarers/aws-transfer-custom-lambda-identity-provider.TransferCustomLambdaIdentityProvider.Initializer.parameter.id"></a>

- *Type:* string

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@gammarers/aws-transfer-custom-lambda-identity-provider.TransferCustomLambdaIdentityProvider.toString">toString</a></code> | Returns a string representation of this construct. |
| <code><a href="#@gammarers/aws-transfer-custom-lambda-identity-provider.TransferCustomLambdaIdentityProvider.with">with</a></code> | Applies one or more mixins to this construct. |

---

##### `toString` <a name="toString" id="@gammarers/aws-transfer-custom-lambda-identity-provider.TransferCustomLambdaIdentityProvider.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

##### `with` <a name="with" id="@gammarers/aws-transfer-custom-lambda-identity-provider.TransferCustomLambdaIdentityProvider.with"></a>

```typescript
public with(mixins: ...IMixin[]): IConstruct
```

Applies one or more mixins to this construct.

Mixins are applied in order. The list of constructs is captured at the
start of the call, so constructs added by a mixin will not be visited.
Use multiple `with()` calls if subsequent mixins should apply to added
constructs.

###### `mixins`<sup>Required</sup> <a name="mixins" id="@gammarers/aws-transfer-custom-lambda-identity-provider.TransferCustomLambdaIdentityProvider.with.parameter.mixins"></a>

- *Type:* ...constructs.IMixin[]

The mixins to apply.

---

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@gammarers/aws-transfer-custom-lambda-identity-provider.TransferCustomLambdaIdentityProvider.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### `isConstruct` <a name="isConstruct" id="@gammarers/aws-transfer-custom-lambda-identity-provider.TransferCustomLambdaIdentityProvider.isConstruct"></a>

```typescript
import { TransferCustomLambdaIdentityProvider } from '@gammarers/aws-transfer-custom-lambda-identity-provider'

TransferCustomLambdaIdentityProvider.isConstruct(x: any)
```

Checks if `x` is a construct.

Use this method instead of `instanceof` to properly detect `Construct`
instances, even when the construct library is symlinked.

Explanation: in JavaScript, multiple copies of the `constructs` library on
disk are seen as independent, completely different libraries. As a
consequence, the class `Construct` in each copy of the `constructs` library
is seen as a different class, and an instance of one class will not test as
`instanceof` the other class. `npm install` will not create installations
like this, but users may manually symlink construct libraries together or
use a monorepo tool: in those cases, multiple copies of the `constructs`
library can be accidentally installed, and `instanceof` will behave
unpredictably. It is safest to avoid using `instanceof`, and using
this type-testing method instead.

###### `x`<sup>Required</sup> <a name="x" id="@gammarers/aws-transfer-custom-lambda-identity-provider.TransferCustomLambdaIdentityProvider.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@gammarers/aws-transfer-custom-lambda-identity-provider.TransferCustomLambdaIdentityProvider.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |

---

##### `node`<sup>Required</sup> <a name="node" id="@gammarers/aws-transfer-custom-lambda-identity-provider.TransferCustomLambdaIdentityProvider.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---





