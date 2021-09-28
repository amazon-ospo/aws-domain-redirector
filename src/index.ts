// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as acm from "@aws-cdk/aws-certificatemanager";
import * as ec2 from "@aws-cdk/aws-ec2";
import * as elbv2 from "@aws-cdk/aws-elasticloadbalancingv2";
import * as route53 from "@aws-cdk/aws-route53";
import * as route53Targets from "@aws-cdk/aws-route53-targets";
import * as cdk from "@aws-cdk/core";

export interface RedirectProps {
  /**
   * Existing Route53 Hosted Zone that controls the source domain.
   */
  readonly hostedZone: route53.IHostedZone;

  /**
   * `RedirectOptions` for the target domain.
   */
  readonly redirectConfig: elbv2.RedirectOptions;

  /**
   * VPC that this `Redirector` instance will use.
   *
   * Some internal `Redirector` components require an VPC,
   * so this is required to avoid VPC proliferation.
   *
   * If you don't already have a VPC,
   * you can use `Redirector.createVpc`
   * to create one with a recommended minimal configuration.
   */
  readonly vpc: ec2.Vpc;
}

/**
 * Create resources for an ALB to redirect from one domain to another.
 */
export class Redirector extends cdk.Construct {
  /**
   * Create an Amazon VPC using the recommended Redirector configuration.
   *
   * Only call this once per scope.
   * If you call this multiple times with the same scope it will fail.
   *
   * @param scope
   * @returns Amazon VPC
   */
  public static createVpc(scope: cdk.Construct): ec2.Vpc {
    return new ec2.Vpc(scope, "RedirectorVpc", { natGateways: 0 });
  }

  protected hostedZone: route53.IHostedZone;

  constructor(scope: cdk.Construct, id: string, props: RedirectProps) {
    super(scope, id);

    this.hostedZone = props.hostedZone;

    this.createAlb({
      vpc: props.vpc,
      redirectConfig: props.redirectConfig,
    });
  }

  /**
   * Create the ALB and hook it up to the hosted zone.
   *
   * @param vpc: VPC to create the ALB instance in
   * @param redirectToDomain: ALB RedirectOptions for redirect action
   * @private
   */
  private createAlb({
    vpc,
    redirectConfig,
  }: {
    vpc: ec2.Vpc;
    redirectConfig: elbv2.RedirectOptions;
  }) {
    const lb = new elbv2.ApplicationLoadBalancer(this, "Redirector", {
      vpc,
      internetFacing: true,
      ipAddressType: elbv2.IpAddressType.IPV4,
    });

    // Route all http to https.
    lb.addRedirect({
      open: true,
      sourcePort: 80,
      sourceProtocol: elbv2.ApplicationProtocol.HTTP,
      targetPort: 443,
      targetProtocol: elbv2.ApplicationProtocol.HTTPS,
    });

    // Make the certificate for this endpoint.
    const certificate = new acm.Certificate(this, "DomainCertificate", {
      domainName: this.hostedZone.zoneName,
      validation: acm.CertificateValidation.fromDns(),
    });

    // Redirect to target.
    const redirectListener = lb.addListener("RedirectListener", {
      open: true,
      port: 443,
      protocol: elbv2.ApplicationProtocol.HTTPS,
      certificates: [certificate],
    });
    redirectListener.addAction("RedirectAction", {
      action: elbv2.ListenerAction.redirect({
        permanent: true,
        ...redirectConfig,
      }),
    });

    // Hook up DNS for the ALB.
    const lbAlias = new route53Targets.LoadBalancerTarget(lb);
    const target = route53.RecordTarget.fromAlias(lbAlias);
    new route53.ARecord(this, "RedirectorDns", {
      target,
      zone: this.hostedZone,
    });
  }
}
