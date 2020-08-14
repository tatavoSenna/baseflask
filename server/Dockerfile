FROM python:3.7.8-alpine3.12

EXPOSE 5000

RUN apk add --update build-base postgresql-dev python3-dev musl-dev libffi-dev tzdata libxml2-dev libxslt-dev
RUN cp /usr/share/zoneinfo/America/Sao_Paulo /etc/localtime
RUN echo "America/Sao_Paulo" >  /etc/timezone

ENV TZ America/Sao_Paulo
ENV LANG pt_BR.UTF-8
ENV LANGUAGE pt_BR.UTF-8
ENV LC_ALL pt_BR.UTF-8

RUN set -ex && mkdir -p /opt/app
WORKDIR /opt/app

COPY . .

RUN pip install --no-cache-dir -r requirements.txt
CMD ./start_app.sh
