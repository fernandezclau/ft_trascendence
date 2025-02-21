FROM debian:latest

RUN apt-get update && \
    apt-get install -y apache2 && \
    apt-get clean

RUN a2enmod ssl

COPY pong-ssl.conf /etc/apache2/sites-available/pong-ssl.conf

RUN a2ensite pong-ssl

COPY ./public_html/ /var/www/html/

EXPOSE 80 443

CMD ["apache2ctl", "-D", "FOREGROUND"]