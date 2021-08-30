# AWS Domain Redirector

The AWS Domain Redirector construct
builds the necessary resources
to redirect all requests to one domain
to a target domain of your choice.
You can choose to redirect all requests to a static location
or redirect to a dynamic location based on the request.

To create a `Redirector`, you need to provide:

- An [Amazon Route 53 Hosted Zone](https://docs.aws.amazon.com/cdk/api/latest/docs/@aws-cdk_aws-route53.HostedZone.html)
  for the domain you want to redirect.
  This has to be created first because Route 53 needs to control the public domain
  in order for a `Redirector` instance to deploy.
- An [Amazon Virtual Private Cloud (Amazon VPC)](https://docs.aws.amazon.com/cdk/api/latest/docs/@aws-cdk_aws-ec2.Vpc.html).
  This Amazon VPC does not need any special configuration,
  but resources that `Redirector` creates need a VPC to exist.
  To avoid stacks with multiple `Redirector` instances creating many Amazon VPCs,
  `Redirector` does not create its own Amazon VPCs.
    - NOTE: If you only use this VPC for `Redirector`,
      you should set `natGateways` to `0`
      to avoid unnecessary costs.
- [RedirectOptions](https://docs.aws.amazon.com/cdk/api/latest/docs/@aws-cdk_aws-elasticloadbalancingv2.RedirectOptions.html)
  that define what the `Redirector` should redirect requests to.

## Example stack

See "example stack with multiple redirects" in [./test/redirect.test.ts](./test/redirect.test.ts).

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

## Security

See [CONTRIBUTING](CONTRIBUTING.md#security-issue-notifications) for more information.

## License

This project is licensed under the Apache-2.0 License.

