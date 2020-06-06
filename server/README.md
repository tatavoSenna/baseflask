## Building you local environmet
There is a dockercompose file that runs the local environment
if you just cloned the repo and it is running the lawing backend for the first tim, start by building the images:
docker-compose build
After tahat you can just start the containers:
docker-compose up

### Importing a to local database
docker exec -i server_mysql_1 sh -c 'exec mysql -uroot -p"password" lawing_local' < doing_law_2020-03-20.sql

### Accessing the database client
docker exec -it server_mysql_1 sh -c 'exec mysql -p"paswword" lawing_local'

###