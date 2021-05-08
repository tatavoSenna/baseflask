#!/bin/sh
aws s3 cp devops/cf-templates/ s3:/cf-templates --profile lawing-prod --recursive --acl public-read
aws cloudformation create-stack \
    --stack-name prod \
    --template-url https://lawing-prod-cf-templates.s3.amazonaws.com/lawing-master-template.yaml \
    --parameter ParameterKey=DBName,ParameterValue=testdb \
        ParameterKey=DBUser,ParameterValue=lawingdbuser \
        ParameterKey=DBPassword,ParameterValue=98798fhe8G8hG5 \
        ParameterKey=DBName,ParameterValue=lawing \
        ParameterKey=GitHubToken,ParameterValue=3f6e104464238d4f5ebffe8d5278f466b36494fa \
        ParameterKey=AppDomainName,ParameterValue=app.lawing.com.br \
        ParameterKey=ApiDomainName,ParameterValue=api.lawing.com.br \
        ParameterKey=TemplateBucket,ParameterValue=lawing-prod-cf-templates \
        ParameterKey=GitHubBranch,ParameterValue=master \
        ParameterKey=ApiLBCertificate,ParameterValue=arn:aws:acm:sa-east-1:386235651823:certificate/2feeaa65-919d-42ab-80c2-baeab2765e52 \
        ParameterKey=AppCertificate,ParameterValue=arn:aws:acm:us-east-1:386235651823:certificate/8751d365-a600-4ae0-8004-5721b7d6c63f \
    --capabilities CAPABILITY_IAM \
    --profile lawing-prod    



    
