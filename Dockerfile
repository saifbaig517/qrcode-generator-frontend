FROM node:alpine

RUN apk add imagemagick potrace --no-cache

RUN npm install -g npm