# Use the Nginx image as the base image
FROM nginx:alpine

# Copy the static files to the Nginx document root
COPY Client /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]