FROM python:3.7.2-stretch

WORKDIR /flask

ADD . /flask

WORKDIR /flask/BE

RUN python -m pip install --upgrade pip
RUN pip install -r requirements.txt


CMD gunicorn -w 1 -b :5000 -k gevent app:app