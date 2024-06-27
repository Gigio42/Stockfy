# Use the Alpine version of the Node.js image as the base image
FROM node:16-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json (if available) to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the Server and Prisma directories into the Docker image
COPY Server ./Server
COPY prisma ./prisma

# Generate Prisma client
RUN npx prisma generate

# Expose port 3000
EXPOSE 3000

# Add a health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 CMD node Server/healthcheck.js

# Run the application
CMD [ "node", "Server/server.js" ]