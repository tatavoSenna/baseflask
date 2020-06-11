FROM python:3.7
WORKDIR /usr/src/server
COPY . ./app
RUN pip install --no-cache-dir -r app/requirements.txt
CMD app/start_app.sh