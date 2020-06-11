aws s3 cp devops/cf-templates/ s3://lawing-cloudformation-template --profile lawing --recursive
aws cloudformation update-stack \
    --stack-name lawing-staging \
    --template-url https://lawing-cloudformation-template.s3.amazonaws.com/lawing-master-template.yaml \
    --parameter ParameterKey=GitHubToken,ParameterValue=1c21655f1a85ce776f4006794026f24bc50a350e \
    --profile lawing

aws s3 cp front/build/ s3://lawing-app --profile lawing --recursive

aws ecr get-login-password --profile lawing | docker login --username AWS --password-stdin 833120502863.dkr.ecr.us-east-1.amazonaws.com/lawing-api