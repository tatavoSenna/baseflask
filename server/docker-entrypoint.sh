#!/bin/sh
set -e
exec /bin/sh -c "\
    flask db upgrade --directory /opt/app/migrations; \
    gunicorn wsgi:app \
        --workers 1 \
        --bind 0.0.0.0:5000
        --access-logfile - \
        --error-logfile - \
        --log-level info;"
exec "$@";
