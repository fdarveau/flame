FROM node:16-alpine3.11 as builder

RUN apk --no-cache --virtual build-dependencies add python python3 make g++

# Get package.json and install modules
COPY package*.json /tmp/server/package.json
RUN cd /tmp/server && npm install
RUN mkdir -p /app && cp -a /tmp/server/node_modules /app/node_modules

# Get package.json and install modules
COPY client/package*.json /tmp/client/package.json
RUN cd /tmp/client && npm install
RUN mkdir -p /app/client && cp -a /tmp/client/node_modules /app/client/node_modules

COPY . /app

RUN mkdir -p /app/public /app/data \
    && cd /app/client \
    && npm run build \
    && mv /app/client/build/* /app/public \
    && rm -rf /app/client

FROM node:16-alpine3.11

COPY --from=builder /app /app

WORKDIR /app

EXPOSE 5005

ENV NODE_ENV=production
ENV PASSWORD=flame_password

CMD ["sh", "-c", "chown -R node /app/data && node server.js"]