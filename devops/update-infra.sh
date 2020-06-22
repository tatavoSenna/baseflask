#!/bin/sh
aws s3 cp devops/cf-templates/ s3://lawing-cognito-cloudformation --profile lawing-cognito --recursive
aws cloudformation update-stack \
    --stack-name lawing-staging \
    --template-url https://lawing-cloudformation-template.s3.amazonaws.com/lawing-master-template.yaml \
    --parameter ParameterKey=GitHubToken,ParameterValue=1c21655f1a85ce776f4006794026f24bc50a350e ParameterKey=AppDomainName,ParameterValue=staging.lawing.com.br \
    --profile lawing