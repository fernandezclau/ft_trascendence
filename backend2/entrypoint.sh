#!/bin/sh
python manage.py migrate
#python manage.py runserver 0.0.0.0:8001
gunicorn api.wsgi:application --bind 0.0.0.0:8001 --workers 3 --log-level debug
