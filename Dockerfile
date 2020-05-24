FROM node:12-alpine3.9

WORKDIR /app

ADD . /app

RUN yarn

CMD yarn start