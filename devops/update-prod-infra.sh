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
        ParameterKey=DBName,UsePreviousValue=true \
        ParameterKey=GitHubToken,UsePreviousValue=true \
        ParameterKey=AppDomainName,UsePreviousValue=true \
        ParameterKey=ApiDomainName,UsePreviousValue=true \
        ParameterKey=TemplateBucket,UsePreviousValue=true \
        ParameterKey=GitHubBranch,UsePreviousValue=true \
        ParameterKey=ApiLBCertificate,UsePreviousValue=true \
        ParameterKey=AppCertificate,UsePreviousValue=true \
        ParameterKey=FlaskSecretKey,UsePreviousValue=true \
        ParameterKey=ConvertApiSecretKey,UsePreviousValue=true \
        ParameterKey=SendGridApiKey,UsePreviousValue=true \
        ParameterKey=D4SignApiURL,UsePreviousValue=true \
        ParameterKey=SignUpOn,ParameterValue=false \
        ParameterKey=StripeApiSecretKey,UsePreviousValue=true \
        ParameterKey=EnvironmentTag,ParameterValue=production \
        ParameterKey=BackEndSentryDSN,UsePreviousValue=true \
        ParameterKey=FrontEndSentryDSN,UsePreviousValue=true \
    --profile \
        lawing-prod
