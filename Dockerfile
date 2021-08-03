FROM node:14-alpine

RUN apk update && apk add --no-cache nano curl

# Get package.json and install modules
COPY package*.json /tmp/package.json
RUN cd /tmp && npm install --production
RUN mkdir -p /app && cp -a /tmp/node_modules /app/

# Get package.json and install modules
COPY client/package*.json /tmp_client/package.json
RUN cd /tmp_client && npm install --production
RUN mkdir -p /app/client && cp -a /tmp_client/node_modules /app/client/

WORKDIR /app

COPY . /app

RUN mkdir -p ./public ./data \
    && cd ./client \
    && npm run build \
    && cd .. \
    && mv ./client/build/* ./public \
    && rm -rf ./client

EXPOSE 5005

ENV NODE_ENV=production

CMD ["node", "server.js"]
