FROM nginx:alpine

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf
COPY conf.d/ /etc/nginx/conf.d/

# Create SSL directory
RUN mkdir -p /etc/nginx/ssl

# Expose ports
EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]

