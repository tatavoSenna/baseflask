#!/bin/sh
aws s3 cp devops/cf-templates/ s3:/cf-templates --profile lawing-prod --recursive --acl public-read
aws cloudformation create-stack \
    --stack-name prod \
    --template-url https://lawing-prod-cf-templates.s3.amazonaws.com/lawing-master-template.yaml \
    --parameter ParameterKey=DBName,ParameterValue=testdb \
        ParameterKey=DBUser,ParameterValue=lawingdbuser \
        ParameterKey=DBPassword,ParameterValue= \
        ParameterKey=DBName,ParameterValue=lawing \
        ParameterKey=GitHubToken,ParameterValue= \
        ParameterKey=AppDomainName,ParameterValue=app.lawing.com.br \
        ParameterKey=ApiDomainName,ParameterValue=api.lawing.com.br \
        ParameterKey=TemplateBucket,ParameterValue=lawing-prod-cf-templates \
        ParameterKey=GitHubBranch,ParameterValue=master \
        ParameterKey=ApiLBCertificate,ParameterValue= \
        ParameterKey=AppCertificate,ParameterValue= \
        ParameterKey=FlaskSecretKey,ParameterValue= \
    --capabilities CAPABILITY_IAM \
    --profile lawing



    
