FROM python:3.11

ENV PYTHONUNBUFFERED=1

RUN apt-get update && \
    apt-get install -y --no-install-recommends postgresql-client && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY . /app

RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 8442

CMD ["sh", "-c", "python manage.py makemigrations api && python manage.py migrate && gunicorn --certfile=/certs/cert.crt --keyfile=/certs/cert.key -b 0.0.0.0:8442 api.wsgi"]
