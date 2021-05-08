#!/bin/sh
aws s3 cp devops/cf-templates/ s3://lawing-prod-cf-templates --profile lawing-prod --recursive --acl public-read
aws cloudformation update-stack \
    --stack-name \
        prod \
    --template-url \
        https://lawing-prod-cf-templates.s3.amazonaws.com/lawing-master-template.yaml \
    --parameter \
        ParameterKey=DBUser,UsePreviousValue=true \
        ParameterKey=DBPassword,UsePreviousValue=true \
        ParameterKey=DBName,ParameterValue=lawing \
        ParameterKey=GitHubToken,ParameterValue=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 \
        ParameterKey=AppDomainName,UsePreviousValue=true \
        ParameterKey=ApiDomainName,UsePreviousValue=true \
        ParameterKey=TemplateBucket,UsePreviousValue=true \
        ParameterKey=GitHubBranch,ParameterValue=master \
        ParameterKey=ApiLBCertificate,UsePreviousValue=true \
        ParameterKey=AppCertificate,UsePreviousValue=true \
    --profile \
        lawing-prod
