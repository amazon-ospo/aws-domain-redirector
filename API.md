# API Reference <a name="API Reference"></a>

## Constructs <a name="Constructs"></a>

### Redirector <a name="@aws/aws-domain-redirector.Redirector"></a>

Create resources for an ALB to redirect from one domain to another.

#### Initializers <a name="@aws/aws-domain-redirector.Redirector.Initializer"></a>

```typescript
import { Redirector } from '@aws/aws-domain-redirector'

new Redirector(scope: Construct, id: string, props: RedirectProps)
```

##### `scope`<sup>Required</sup> <a name="@aws/aws-domain-redirector.Redirector.parameter.scope"></a>

- *Type:* [`@aws-cdk/core.Construct`](#@aws-cdk/core.Construct)

---

##### `id`<sup>Required</sup> <a name="@aws/aws-domain-redirector.Redirector.parameter.id"></a>

- *Type:* `string`

---

##### `props`<sup>Required</sup> <a name="@aws/aws-domain-redirector.Redirector.parameter.props"></a>

- *Type:* [`@aws/aws-domain-redirector.RedirectProps`](#@aws/aws-domain-redirector.RedirectProps)

---


#### Static Functions <a name="Static Functions"></a>

##### `createVpc` <a name="@aws/aws-domain-redirector.Redirector.createVpc"></a>

```typescript
import { Redirector } from '@aws/aws-domain-redirector'

Redirector.createVpc(scope: Construct)
```

###### `scope`<sup>Required</sup> <a name="@aws/aws-domain-redirector.Redirector.parameter.scope"></a>

- *Type:* [`@aws-cdk/core.Construct`](#@aws-cdk/core.Construct)

---



## Structs <a name="Structs"></a>

### RedirectProps <a name="@aws/aws-domain-redirector.RedirectProps"></a>

#### Initializer <a name="[object Object].Initializer"></a>

```typescript
import { RedirectProps } from '@aws/aws-domain-redirector'

const redirectProps: RedirectProps = { ... }
```

##### `hostedZone`<sup>Required</sup> <a name="@aws/aws-domain-redirector.RedirectProps.property.hostedZone"></a>

```typescript
public readonly hostedZone: IHostedZone;
```

- *Type:* [`@aws-cdk/aws-route53.IHostedZone`](#@aws-cdk/aws-route53.IHostedZone)

Existing Route53 Hosted Zone that controls the source domain.

---

##### `redirectConfig`<sup>Required</sup> <a name="@aws/aws-domain-redirector.RedirectProps.property.redirectConfig"></a>

```typescript
public readonly redirectConfig: RedirectOptions;
```

- *Type:* [`@aws-cdk/aws-elasticloadbalancingv2.RedirectOptions`](#@aws-cdk/aws-elasticloadbalancingv2.RedirectOptions)

`RedirectOptions` for the target domain.

---

##### `vpc`<sup>Required</sup> <a name="@aws/aws-domain-redirector.RedirectProps.property.vpc"></a>

```typescript
public readonly vpc: Vpc;
```

- *Type:* [`@aws-cdk/aws-ec2.Vpc`](#@aws-cdk/aws-ec2.Vpc)

VPC that this `Redirector` instance will use.

Some internal `Redirector` components require an VPC,
so this is required to avoid VPC proliferation.

If you don't already have a VPC,
you can use `Redirector.createVpc`
to create one with a recommended minimal configuration.

---



