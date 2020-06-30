#!/bin/sh
aws s3 cp devops/cf-templates/ s3://lawing-cognito-cloudformation --profile lawing-cognito --recursive
aws cloudformation create-stack \
    --stack-name lawing-db-test \
    --template-url https://lawing-cognito-cloudformation.s3.amazonaws.com/templates/rds-postgres.yaml \
    --parameter ParameterKey=DBName,ParameterValue=testdb \
        ParameterKey=DBUser,ParameterValue=testdbuser \
        ParameterKey=DBPassword,ParameterValue=98798fhe8G8hG5 \
        ParameterKey=VpcId,ParameterValue=vpc-084deb8c5666c1c98 \
        ParameterKey=Subnets,ParameterValue=subnet-055696bed2e8f69cc,subnet-0a44520a0274cbb01 \
    --profile lawing-cognito