#!/bin/bash

# Start Django backend
python manage.py runserver 0.0.0.0:8000 &

# Start React frontend
npm --prefix frontend run dev
