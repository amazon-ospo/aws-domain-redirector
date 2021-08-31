## Example Stack

From "example stack with multiple redirects" in [../test/redirect.test.ts](../test/redirect.test.ts).

```typescript
const app = new cdk.App();
const stack = new cdk.Stack(app, 'ExampleStack');

// Create an Amazon VPC with the recommended settings.
const vpc = Redirector.createVpc(stack);

// This redirect only changes the domain and retains all other aspects of each request.
const hostOnlyRedirectZone = new route53.HostedZone(
  stack,
  'HostOnlyRedirectZone',
  {
    zoneName: 'deprecated-domain.example.com',
  },
);
new Redirector(stack, 'HostOnlyRedirector', {
  hostedZone: hostOnlyRedirectZone,
  redirectConfig: { host: 'new-domain.example.com' },
  vpc,
});

// This redirect sends all requests to a single, static target.
const staticRedirectZone = new route53.HostedZone(stack, 'StaticRedirectZone', {
  zoneName: 'another-deprecated-domain.example.com',
});
new Redirector(stack, 'StatisRedirector', {
  hostedZone: staticRedirectZone,
  redirectConfig: {
    host: 'static-target.example.com',
    path: '/path/to/my/target',
    query: '',
  },
  vpc,
});
```
