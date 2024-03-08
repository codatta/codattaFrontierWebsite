# Stage 1: Build dependencies
FROM node:20-alpine as dependencies

WORKDIR /opt/

#这两个文件要提交到git仓库
COPY ./ /opt/

#非打包机打包的话注释下面这句话
# RUN yarn config set registry http://192.168.31.52:11180/repository/group-npm/
# Install dependencies only if lock file changes

# Stage 2: Build the application

# Copy the rest of the application code
RUN yarn install
RUN yarn add antd

# Build the application
RUN yarn build

# Stage 3: Create the final image
FROM nginx:1.25.2-alpine-slim

ENV NGINX_ENVSUBST_OUTPUT_DIR=/etc/nginx/

# Copy built artifacts from the build stage
COPY --from=dependencies /opt/dist /usr/share/nginx/html/
COPY --from=dependencies /opt/default.conf /etc/nginx/conf.d/


#CMD ["/bin/sh","-c", "nginx -g 'daemon off;'"]
