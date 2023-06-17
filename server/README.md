# Lawing

## Flask Back-end

### Development setup



1. First, make your own copy of .env file.
```
$ cp .env.sample .env
```
2. Add aws access information to .env. Ask your system admin to create one for you.
```
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_DEFAULT_REGION=
```
3. Build and start the Docker images
```
$ cd server
$ docker-compose up
```
Docker will create 2 containers. The flask app, the postgres server

3. Point your browser to *http://127.0.0.0:5000* and you should see the message, "Welcome to lawing api"
