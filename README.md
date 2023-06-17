## Create a new environment
1. pick a domain for your appand your api. For example:
    - app.example.com
    - api.example.com
2. Create an ssl certificate on AWS Certificate Manager and take note of the certificate url
3. Create a github v2 code start connection to this repository. Take note of the connection arn.

## Update this infrastructure
- upgrade the node version in front deploy pipeline
- create a docker repo on ecs and push the latest python image
- update the base image of server/devops/dockerfile.prod to the puthon image om aws repo