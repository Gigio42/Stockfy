FROM nginx:alpine

COPY Client /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

RUN addgroup -g 1001 -S appgroup && \
    adduser -S appuser -G appgroup -u 1001 && \
    chown -R appuser:appgroup /usr/share/nginx/html && \
    chown -R appuser:appgroup /var/cache/nginx && \
    mkdir -p /var/run/appuser && chown -R appuser:appgroup /var/run/appuser

USER appuser

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]