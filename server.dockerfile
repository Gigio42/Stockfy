# ---- Build Stage ----
    FROM node:20-alpine AS build

    WORKDIR /usr/src/app
    
    COPY package*.json ./
    
    ENV NODE_ENV=production
    
    RUN npm ci
    
    COPY Server ./Server
    COPY prisma ./prisma
    
    RUN npx prisma generate
    
    # ---- Run Stage ----
    FROM node:20-alpine
    
    WORKDIR /usr/src/app
    
    COPY --from=build /usr/src/app .
    
    # Instalação do Dockerize
    ENV DOCKERIZE_VERSION v0.6.1
    
    # Verifique a arquitetura e baixe a versão apropriada do Dockerize
    RUN if [ "$(uname -m)" = "x86_64" ]; then \
            wget https://github.com/jwilder/dockerize/releases/download/${DOCKERIZE_VERSION}/dockerize-linux-amd64-${DOCKERIZE_VERSION}.tar.gz \
            && tar -C /usr/local/bin -xzvf dockerize-linux-amd64-${DOCKERIZE_VERSION}.tar.gz \
            && rm dockerize-linux-amd64-${DOCKERIZE_VERSION}.tar.gz; \
        else \
            wget https://github.com/jwilder/dockerize/releases/download/${DOCKERIZE_VERSION}/dockerize-linux-armhf-${DOCKERIZE_VERSION}.tar.gz \
            && tar -C /usr/local/bin -xzvf dockerize-linux-armhf-${DOCKERIZE_VERSION}.tar.gz \
            && rm dockerize-linux-armhf-${DOCKERIZE_VERSION}.tar.gz; \
        fi
    
    RUN adduser -D appuser
    RUN chown -R appuser /usr/src/app
    
    USER appuser
    
    EXPOSE 3000
    
    HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 CMD node Server/healthcheck.js
    
    CMD [ "node", "Server/server.js" ]
    