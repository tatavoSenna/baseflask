# Lawing

## Flask Back-end

### Development setup



1. First, make your own copy of .env file.
```
$ cp .env.sample .env
```
2. Now you have to add aws access information to .env. Ask your system admin to create one for you.
```
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
```
3. Build and start the Docker images
```
$ cd server
$ docker-compose up
```
Docker will create 3 containers. The flask app, the postgres server and a pgadmin.

3. Point your browser to *http://127.0.0.0:5000* and you should see the message, "Welcome to lawing api"
