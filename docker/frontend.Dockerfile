# Use public Docker Hub by default; override via build args for corporate pull-through cache.
ARG DOCKER_REGISTRY=docker.io
ARG NPM_REGISTRY=https://registry.npmjs.org/

FROM ${DOCKER_REGISTRY}/library/node AS build

# Install necessary packages for git
RUN apt-get update && apt-get install -y git && apt-get clean

COPY frontend /app/frontend

WORKDIR /app/frontend

ARG NPM_REGISTRY
RUN npm install -g typescript vite --registry ${NPM_REGISTRY}
RUN npm install --registry ${NPM_REGISTRY} && npm run build

FROM ${DOCKER_REGISTRY}/library/nginx:alpine

COPY --from=build /app/frontend/dist /usr/share/nginx/html

COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
