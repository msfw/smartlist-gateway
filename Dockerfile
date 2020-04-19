FROM node:13.12.0-alpine3.11
WORKDIR /usr/gateway/src
COPY ./package*.json ./
RUN npm install
COPY . /usr/gateway
CMD ["npm", "start"]