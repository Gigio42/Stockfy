FROM node:16-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY Server ./Server
COPY prisma/postgresql ./prisma

RUN npx prisma generate

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 CMD node Server/healthcheck.js

CMD [ "node", "Server/server.js" ]