FROM python:3.7
WORKDIR /usr/src/app
COPY . .
RUN pip install --no-cache-dir -r requirements.txt
ENV FLASK_APP=application.py
# CMD ["gunicorn", "run", "--host=0.0.0.0"]