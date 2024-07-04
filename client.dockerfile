FROM nginx:alpine

COPY Client /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]