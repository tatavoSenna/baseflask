#!/bin/sh
DEPLOY_BRANCH=${DEPLOY_BRANCH:=cognito}
aws s3 cp devops/cf-templates/ s3://lawing-cognito-cloudformation --profile lawing-cognito --recursive
aws cloudformation update-stack \
    --stack-name \
        lawing-cognito \
    --template-url \
        https://lawing-cognito-cloudformation.s3.amazonaws.com/lawing-master-template.yaml \
    --parameter \
        ParameterKey=GitHubToken,ParameterValue=3f6e104464238d4f5ebffe8d5278f466b36494fa \
        ParameterKey=AppDomainName,ParameterValue=cognito.lawing.com.br \
        ParameterKey=DBUser,ParameterValue=lawingdbuser ParameterKey=DBPassword,ParameterValue=hHgTf54Rf \
        ParameterKey=TemplateBucket,ParameterValue=lawing-cognito-cloudformation \
        ParameterKey=GitHubBranch,ParameterValue=$DEPLOY_BRANCH \
    --profile \
        lawing-cognito
