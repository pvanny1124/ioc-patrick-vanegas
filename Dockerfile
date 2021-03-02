FROM node:11-alpine
RUN mkdir -p /usr/local/src
COPY . /usr/local/src
WORKDIR /usr/local/src

RUN npm install && npm i -g nodemon
CMD ["nodemon", "start"]
