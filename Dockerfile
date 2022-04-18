FROM node:16-alpine

WORKDIR /app

ADD . /app

RUN yarn

CMD yarn start