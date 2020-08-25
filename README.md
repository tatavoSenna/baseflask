# Lawing

## Flask Back-end

### Development setup

1) Build and start Docker images
```
$ cd server
$ docker-compose up --build -d
```

2) Make your own copy of .env file  
```
$ cp .env.sample .env
```

3) Enter app container
```
$ docker exec -it server_app_1 /bin/sh
```

4) Execute migrations
```
$ flask db upgrade --directory /opt/app/migrations;
```

5) Run flask server
```
$ flask run
```

6) Point your browser to *http://127.0.0.0:5000*

