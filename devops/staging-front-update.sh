
#!/bin/sh
cd front
export NODE_ENV=staging
yarn build
cd ..
aws s3 cp front/build/ s3://lawing-app --profile lawing --recursive --acl public-read
aws cloudfront create-invalidation --distribution-id E2YHPG9IX2A98K --paths "/*" --profile lawing