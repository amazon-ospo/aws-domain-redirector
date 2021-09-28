# How to Use

First, we need an AWS Cloud Development Kit (AWS CDK) stack
to add our resources to.

```typescript
const app = new cdk.App();
const stack = new cdk.Stack(app, 'ExampleStack');
```

To create a `Redirector` instance, we need a VPC.
If you already have one, you can use that,
or you can use `Redirector`'s helper function to create one:

```typescript
const vpc = Redirector.createVpc(stack);
```

Next, we need a Route 53 hosted zone.
If this hosted zone controls the domain root,
you can create the hosted zone and the `Redirector` at the same time.
However, if another DNS authority
delegates control of the domain to your hosted zone,
you must create the hosted zone first.
This is necessary because `Redirector`
needs control of the domain
in order to create the certificate
using AWS Certificate Manager.

```typescript
const hostOnlyRedirectZone = new route53.HostedZone(
  stack,
  'HostOnlyRedirectZone',
  {
    zoneName: 'deprecated-domain.example.com',
  },
);
```

Now that we have both the VPC and hosted zone,
we can create the `Redirector`.

```typescript
new Redirector(stack, 'HostOnlyRedirector', {
  hostedZone: hostOnlyRedirectZone,
  redirectConfig: { host: 'new-domain.example.com' },
  vpc,
});
```

## Full Example

For full stack definition, see
"example stack with multiple redirects"
in [../test/redirect.test.ts](../test/redirect.test.ts).
