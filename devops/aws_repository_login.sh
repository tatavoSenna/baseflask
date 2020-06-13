
#! bin/sh
aws ecr get-login-password --profile lawing | docker login --username AWS --password-stdin 833120502863.dkr.ecr.us-east-1.amazonaws.com/lawing-api