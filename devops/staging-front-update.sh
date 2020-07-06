
#!/bin/sh
cd front
export NODE_ENV=staging
yarn build
cd ..
aws s3 cp front/build/ s3://lawing-cognito-app --profile lawing-cognito --recursive --acl public-read
aws cloudfront create-invalidation --distribution-id E31J49Z8FECJB0 --paths "/*" --profile lawing-cognito