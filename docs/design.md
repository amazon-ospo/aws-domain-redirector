## AWS Domain Redirector Goals and Design

The goal of the AWS Domain Redirector (Redirector)
is to be the simplest and cheapest (in that order) way to set up
domain redirection in AWS.
To accomplish this, Redirector uses 
the built-in redirection feature of
Elastic Load Balancing (ELB) Application Load Balancers
to offload all the work to ELB.
By using the [Application Load Balancer `redirect` action](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/load-balancer-listeners.html#redirect-actions),
we get nuanced redirection with no running code to maintain.
In addition to the Application Load Balancer,
Redirect creates the appropriate DNS A Record in Amazon Route 53
and a TLS certificate for the load balancer
in AWS Certificate Manager.

The Application Load Balancer needs
an Amazon Virtual Private Cloud (Amazon VPC),
but it doesn't actually do anything with it in the context of Redirector,
so it could be any VPC.
However, since the default account quota is five VPCs per region,
we don't want to create unnecessary VPCs
by creating one for every Redirector instance.
To avoid proliferation,
rather than creating a VPC for every load balancer
Redirector provide a helper function that creates a basic VPC
and each Redirector instance requires a VPC as input.

### Pricing Estimates

Assumptions:

- 100 TPS average
- 500B/redirect
  - rough estimate based on testing
- 30 days per month

**Elastic Load Balancing Application Load Balancer**

- 25 new connections/s : 100TPS = 4 LCU
- 3,000 active connections/m : 100TPS * 60s = 2LCU
- 1GB/h : 100 TPS = 50,000 B/s = 180MB/h = 1LCU
- 1,000 rule evaluations : 0 evaluations = 0LCU

$0.0225 ALB + 4($0.008 LCU) = $0.0545/hour = $39.24/month

**Amazon API Gateway + AWS Lambda**

- API Gateway HTTP : $1.00 / million : 100TPS = 259,200,000 TPMo = $259.20/month
- Lambda : $0.20 / million + $0.0000166667 / GB-s : $51.84 + $54.43 = $106.27/month
  - assumption: 100ms at 128MB

Total : $365.47/month

(break-even with ALB: ~6TPS at ~$1.41 / million requests)

**Elastic Load Balancing Network Load Balancer (TLS) + Amazon Elastic Compute Cloud (Amazon EC2)**

Network Load Balancer:

- 50 new connections/s : 100TPS = 2LCU
- 3,000 active TLS connections/m : 100TPS * 60 = 2LCU
- 1GB/h : 100 TPS = 50,000 B/s = 180MB/h = 1LCU

$0.0225 ALB + 4($0.006 LCU) = $0.0465/h = $33.48/month

Amazon EC2:

- 6x t4g-medium at $24.528/month each = $147.17/month
  - assumption: each of these can probably handle
    [at least ~20TPS](https://www.vpsbenchmarks.com/posts/ec2_t4g_graviton2_benchmarks)

Total : $180.65/month
