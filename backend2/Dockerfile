FROM python:3.11

ENV PYTHONUNBUFFERED=1

WORKDIR /code

RUN apt update && apt install -y postgresql-client

COPY requirements.txt /code/
RUN pip install --no-cache-dir -r requirements.txt

COPY . /code/

# Eliminar cachés al construir la imagen
RUN rm -rf /code/migrations /code/**/migrations /code/__pycache__
