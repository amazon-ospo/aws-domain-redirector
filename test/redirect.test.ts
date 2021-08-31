// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import {
  expect as expectCDK,
  countResources,
  haveResourceLike,
} from "@aws-cdk/assert";
import * as ec2 from "@aws-cdk/aws-ec2";
import * as route53 from "@aws-cdk/aws-route53";
import * as cdk from "@aws-cdk/core";
import { Redirector } from "../src";

describe("createVpc", () => {
  it("creates exactly one VPC", () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, "TestStack");

    expectCDK(stack).to(countResources("AWS::EC2::VPC", 0));
    Redirector.createVpc(stack);
    expectCDK(stack).to(countResources("AWS::EC2::VPC", 1));
  });

  it("fails if called more than once on same context", () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, "TestStack");

    Redirector.createVpc(stack);
    expect(() => {
      Redirector.createVpc(stack);
    }).toThrow();
  });
});

describe("Redirector expected resources", () => {
  const initResources = (): {
    vpc: ec2.Vpc;
    stack: cdk.Stack;
    hostedZone: route53.HostedZone;
  } => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, "TestStack");
    const vpc = Redirector.createVpc(stack);

    const hostedZone = new route53.HostedZone(stack, "HostOnlyZone", {
      zoneName: "foo.bar",
    });

    new Redirector(stack, "HostOnlyRedirect", {
      hostedZone,
      redirectConfig: { host: "much.wow" },
      vpc,
    });

    return { vpc, stack, hostedZone };
  };

  it("creates exactly one DNS record for the ALB", () => {
    const { stack, hostedZone } = initResources();

    expectCDK(stack).to(countResources("AWS::Route53::RecordSet", 1));
    expectCDK(stack).to(
      haveResourceLike("AWS::Route53::RecordSet", {
        Type: "A",
        Name: `${hostedZone.zoneName}.`,
      })
    );
  });

  it("creates exactly one certificate for the ALB", () => {
    const { stack, hostedZone } = initResources();

    expectCDK(stack).to(
      countResources("AWS::CertificateManager::Certificate", 1)
    );
    expectCDK(stack).to(
      haveResourceLike("AWS::CertificateManager::Certificate", {
        DomainName: hostedZone.zoneName,
      })
    );
  });

  it("creates exactly one ALB", () => {
    const { stack } = initResources();

    expectCDK(stack).to(
      countResources("AWS::ElasticLoadBalancingV2::LoadBalancer", 1)
    );
    expectCDK(stack).to(
      haveResourceLike("AWS::ElasticLoadBalancingV2::LoadBalancer", {
        IpAddressType: "ipv4",
        Scheme: "internet-facing",
        Type: "application",
      })
    );
  });

  it("creates two listeners on the ALB that perform the redirects", () => {
    const { stack } = initResources();

    expectCDK(stack).to(
      countResources("AWS::ElasticLoadBalancingV2::Listener", 2)
    );
    expectCDK(stack).to(
      haveResourceLike("AWS::ElasticLoadBalancingV2::Listener", {
        Port: 80,
        Protocol: "HTTP",
        DefaultActions: [
          {
            Type: "redirect",
            RedirectConfig: {
              Port: "443",
              Protocol: "HTTPS",
              StatusCode: "HTTP_301",
            },
          },
        ],
      })
    );
    expectCDK(stack).to(
      haveResourceLike("AWS::ElasticLoadBalancingV2::Listener", {
        Port: 443,
        Protocol: "HTTPS",
        DefaultActions: [
          {
            Type: "redirect",
            RedirectConfig: {
              Host: "much.wow",
              StatusCode: "HTTP_301",
            },
          },
        ],
      })
    );
  });

  it("does not create any target groups on the ALB", () => {
    const { stack } = initResources();

    expectCDK(stack).to(
      countResources("AWS::ElasticLoadBalancingV2::TargetGroup", 0)
    );
  });
});

describe("example Redirector stacks", () => {
  it("creates a stack with one host-only redirect", () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, "ExampleStack");

    const vpc = Redirector.createVpc(stack);

    const hostedZone = new route53.HostedZone(stack, "HostOnlyZone", {
      zoneName: "foo.bar",
    });

    new Redirector(stack, "HostOnlyRedirect", {
      hostedZone,
      redirectConfig: { host: "much.wow" },
      vpc,
    });
  });

  it("creates a stack with one full redirect", () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, "ExampleStack");

    const vpc = Redirector.createVpc(stack);

    const hostedZone = new route53.HostedZone(stack, "HostOnlyZone", {
      zoneName: "foo.bar",
    });

    new Redirector(stack, "HostOnlyRedirect", {
      hostedZone,
      redirectConfig: {
        protocol: "https",
        host: "much.wow",
        path: "/baz/wut",
        query: "who=me",
      },
      vpc,
    });
  });

  it("creates a stack with multiple redirects", () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, "ExampleStack");

    // Create an Amazon VPC with the recommended settings.
    const vpc = Redirector.createVpc(stack);

    // This redirect only changes the domain and retains all other aspects of each request.
    const hostOnlyRedirectZone = new route53.HostedZone(
      stack,
      "HostOnlyRedirectZone",
      {
        zoneName: "deprecated-domain.example.com",
      }
    );
    new Redirector(stack, "HostOnlyRedirector", {
      hostedZone: hostOnlyRedirectZone,
      redirectConfig: { host: "new-domain.example.com" },
      vpc,
    });

    // This redirect sends all requests to a single, static target.
    const staticRedirectZone = new route53.HostedZone(
      stack,
      "StaticRedirectZone",
      {
        zoneName: "another-deprecated-domain.example.com",
      }
    );
    new Redirector(stack, "StatisRedirector", {
      hostedZone: staticRedirectZone,
      redirectConfig: {
        host: "static-target.example.com",
        path: "/path/to/my/target",
        query: "",
      },
      vpc,
    });
  });
});
