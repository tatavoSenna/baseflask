
#! bin/sh
aws ecr get-login-password --region us-east-1 --profile lawing-prod | docker login --username AWS --password-stdin 340326915472.dkr.ecr.us-east-1.amazonaws.com