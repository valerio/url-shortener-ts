FROM node:8-slim

WORKDIR /server
COPY . /server

RUN npm install
RUN npm run build
RUN npm i -g pm2

EXPOSE 8080
CMD [ "pm2-docker", "--json", "./dist/server.js" ]
