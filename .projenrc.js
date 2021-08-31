const { AwsCdkConstructLibrary, ProjectType } = require("projen");
const project = new AwsCdkConstructLibrary({
  description: "Easily redirect one domain to another.",
  author: "mattsb42-aws",
  authorAddress: "bullocm@amazon.com",
  name: "aws-domain-redirector",
  repository: "https://github.com/awslabs/aws-domain-redirector",
  cdkVersion: "1.95.2",
  cdkAssert: true,
  cdkDependencies: [
    "@aws-cdk/core",
    "@aws-cdk/aws-certificatemanager",
    "@aws-cdk/aws-ec2",
    "@aws-cdk/aws-elasticloadbalancingv2",
    "@aws-cdk/aws-route53",
    "@aws-cdk/aws-route53-targets",
  ],
  gitignore: [".idea"],
  eslint: true,
  eslintOptions: {
    prettier: true,
  },
  projectType: ProjectType.LIB,
  docgen: true,
  // Release Configuration
  defaultReleaseBranch: "main",
  // TODO: Turn these on as we're ready.
  releaseToNpm: false,
  publishToGo: false,
  publishToMaven: false,
  publishToNuget: false,
  publishToPypi: false,
});
project.synth();
