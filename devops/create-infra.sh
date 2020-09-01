#!/bin/sh
aws s3 cp devops/cf-templates/ s3://lawing-cognito-cloudformation --profile lawing-cognito --recursive
aws cloudformation create-stack \
    --stack-name cognito \
    --template-url https://lawing-cognito-cloudformation.s3.amazonaws.com/lawing-master-template.yaml \
    --parameter ParameterKey=DBName,ParameterValue=testdb \
        ParameterKey=DBUser,ParameterValue=lawingdbuser \
        ParameterKey=DBPassword,ParameterValue=98798fhe8G8hG5 \
        ParameterKey=GitHubToken,ParameterValue=3f6e104464238d4f5ebffe8d5278f466b36494fa \
        ParameterKey=AppDomainName,ParameterValue=cognito.lawing.com.br \
        ParameterKey=TemplateBucket,ParameterValue=lawing-cognito-cloudformation \
        ParameterKey=GitHubBranch,ParameterValue=cognito\
    --capabilities CAPABILITY_IAM \
    --profile lawing-cognito