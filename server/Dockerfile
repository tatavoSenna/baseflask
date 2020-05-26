FROM python:3.7
WORKDIR /usr/src/server
COPY . ./app
RUN pip install --no-cache-dir -r app/requirements.txt
CMD ["gunicorn", "app:application", "--workers 1", "-b 0.0.0.0:5000"]