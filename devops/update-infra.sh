#!/bin/sh
aws s3 cp devops/cf-templates/ s3://lawing-cloudformation-template --profile lawing --recursive --acl public-read
aws cloudformation update-stack \
    --stack-name \
        dev \
    --template-url \
        https://lawing-cloudformation-template.s3.amazonaws.com/lawing-master-template.yaml \
    --parameter \
        ParameterKey=GitHubToken,ParameterValue=3f6e104464238d4f5ebffe8d5278f466b36494fa \
        ParameterKey=AppDomainName,ParameterValue=dev.lawing.com.br \
        ParameterKey=DBUser,ParameterValue=lawingdbuser ParameterKey=DBPassword,ParameterValue=hHgTf54Rf \
        ParameterKey=TemplateBucket,ParameterValue=lawing-cloudformation-template \
        ParameterKey=GitHubBranch,ParameterValue=dev \
    --profile \
        lawing
