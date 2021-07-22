#!/bin/sh
psql --host=dd13p1m240zg5c6.c6j0e3wqx2rr.us-east-1.rds.amazonaws.com --dbname lawing \
--username=dbuser --password \
--command="CREATE DATABASE metabase"