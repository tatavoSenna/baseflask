#!/bin/sh
aws s3 cp devops/cf-templates/ s3://dev-lawing-templates --profile lawing-dev --recursive --acl public-read
aws cloudformation update-stack \
    --stack-name \
        dev-lawing \
    --template-url \
        https://dev-lawing-templates.s3.amazonaws.com/lawing-master-template.yaml \
    --parameter \
        ParameterKey=DBUser,UsePreviousValue=true \
        ParameterKey=DBPassword,UsePreviousValue=true \
        ParameterKey=DBName,ParameterValue=lawing \
        ParameterKey=GitHubToken,UsePreviousValue=true \
        ParameterKey=AppDomainName,UsePreviousValue=true \
        ParameterKey=ApiDomainName,UsePreviousValue=true \
        ParameterKey=TemplateBucket,ParameterValue=dev-lawing-templates\
        ParameterKey=GitHubBranch,ParameterValue=master \
        ParameterKey=ApiLBCertificate,UsePreviousValue=true \
        ParameterKey=AppCertificate,UsePreviousValue=true \
        ParameterKey=FlaskSecretKey,UsePreviousValue=true \
        ParameterKey=ConvertApiSecretKey,UsePreviousValue=true \
        ParameterKey=SendGridApiKey,ParameterValue=UsePreviousValue=true \
    --profile \
        lawing-dev