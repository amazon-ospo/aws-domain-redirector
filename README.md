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

## Further Reading

- To see how to use `Redirector` in practice,
  see [Example Stack](./docs/example.md).
- For details on how to call `Redirector`,
  see the [API Reference](./API.md).
- For more information about how `Redirector` works,
  see [Goals and Design](./docs/design.md).

## Security

See [CONTRIBUTING](CONTRIBUTING.md#security-issue-notifications) for more information.

## License

This project is licensed under the Apache-2.0 License.

