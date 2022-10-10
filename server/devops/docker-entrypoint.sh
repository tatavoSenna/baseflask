#!/bin/sh
set -e
exec /bin/sh -c "\
    flask db upgrade --directory /opt/app/migrations; \
    gunicorn wsgi:app \
        --workers 4 \
        --bind 0.0.0.0:5000 \
        --log-level debug"
exec "$@";
