const { AwsCdkConstructLibrary, ProjectType } = require("projen");
const project = new AwsCdkConstructLibrary({
  name: "aws-domain-redirector",
  description: "AWS CDK construct to redirect one domain to another.",
  repository: "https://github.com/awslabs/aws-domain-redirector",
  author: "mattsb42-aws",
  authorAddress: "bullocm@amazon.com",
  copyrightOwner: "Amazon.com Inc. or its affiliates",
  license: "Apache-2.0",
  // CDK and dependencies
  projectType: ProjectType.LIB,
  cdkVersion: "1.124.0",
  cdkAssert: true,
  cdkDependencies: [
    "@aws-cdk/core",
    "@aws-cdk/aws-certificatemanager",
    "@aws-cdk/aws-ec2",
    "@aws-cdk/aws-elasticloadbalancingv2",
    "@aws-cdk/aws-route53",
    "@aws-cdk/aws-route53-targets",
  ],
  // Disable stale issues workflow
  stale: false,
  // Other Configuration
  gitignore: [".idea"],
  eslint: true,
  eslintOptions: {
    prettier: true,
    fileExtensions: [".ts", ".md"],
    dirs: ["src", "test", "docs"],
  },
  docgen: true,
  docsDirectory: "docs",
  pullRequestTemplateContents: [
    "*Issue #, if available:*",
    "",
    "*Description of changes:*",
    "",
    "By submitting this pull request ",
    "I confirm that you can use, modify, copy, and redistribute this contribution ",
    "under the terms of your choice.",
  ],
  // Release Configuration
  defaultReleaseBranch: "main",
  packageName: "@aws/aws-domain-redirector",
  releaseToNpm: true,
  // TODO: Turn these on as we're ready.
  publishToGo: false,
  publishToMaven: false,
  publishToNuget: false,
  publishToPypi: false,
});

// Markdown linting configuration
project.addDevDeps("eslint-plugin-md");
project.eslint.config.extends.push("plugin:md/recommended");
project.eslint.addOverride({
  files: ["*.md"],
  parser: "markdown-eslint-parser",
  rules: {
    "prettier/prettier": ["error", { parser: "markdown" }],
    "@typescript-eslint/no-floating-promises": "off",
    "@typescript-eslint/return-await": "off",
  },
});
project.eslint.addRules({
  "md/remark": [
    "error",
    {
      plugins: [
        "preset-lint-markdown-style-guide",
        ["lint-list-item-indent", "space"],
      ],
    },
  ],
});

project.synth();
