const { AwsCdkConstructLibrary } = require('projen');
const project = new AwsCdkConstructLibrary({
  author: 'mattsb42-aws',
  authorAddress: 'bullocm@amazon.com',
  defaultReleaseBranch: 'main',
  name: 'aws-domain-redirector',
  repository: 'https://github.com/awslabs/aws-domain-redirector',
  cdkVersion: '1.95.2',
  cdkAssert: true,
  cdkDependencies: [
    '@aws-cdk/core',
    '@aws-cdk/aws-certificatemanager',
    '@aws-cdk/aws-ec2',
    '@aws-cdk/aws-elasticloadbalancingv2',
    '@aws-cdk/aws-route53',
    '@aws-cdk/aws-route53-targets',
  ],
  gitignore: ['.idea'],
  // deps: [],                          /* Runtime dependencies of this module. */
  // description: undefined,            /* The description is just a string that helps people understand the purpose of the package. */
  // devDeps: [],                       /* Build dependencies for this module. */
  // packageName: undefined,            /* The "name" in package.json. */
  // projectType: ProjectType.UNKNOWN,  /* Which type of project this is (library/app). */
  // release: undefined,                /* Add release management to this project. */
});
project.synth();