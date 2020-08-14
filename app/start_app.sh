#!/bin/sh
cd app
export FLASK_APP=application.py
flask db upgrade
cd ..
gunicorn app:application --workers 1 -b 0.0.0.0:5000