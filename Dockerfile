FROM nginx:1.25.2-alpine-slim

ENV NGINX_ENVSUBST_OUTPUT_DIR=/etc/nginx/

# Copy built artifacts from the build stage
COPY ./dist /usr/share/nginx/html/
COPY ./default.conf /etc/nginx/conf.d/
