FROM node:20
WORKDIR /usr/src/superpoll-api
COPY ./package.json .
RUN npm install