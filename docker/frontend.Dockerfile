# Use node to build the frontend

# Use official Node image for build stage
FROM node:20 AS build

# Install necessary packages for git
RUN apt-get update && apt-get install -y git && apt-get clean

# Set working directory
WORKDIR /app/frontend

# Copy package.json and package-lock.json first for better caching
COPY frontend/package*.json ./

# Install dependencies (including devDependencies for build)
RUN npm install

# Copy the rest of the frontend source
COPY frontend/ .

# Build the frontend
RUN npm run build

# Use Nginx to serve the frontend
FROM nginx:alpine

# Install curl for health checks
RUN apk add --no-cache curl

# Copy the build output to the Nginx HTML directory
COPY --from=build /app/frontend/dist /usr/share/nginx/html

# Copy custom Nginx configuration
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]