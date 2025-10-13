# Use node to build the frontend
FROM node AS build

# Install necessary packages for git
RUN apt-get update && apt-get install -y git && apt-get clean

# Copy backend directory to /app/frontend
COPY frontend /app/frontend

# Install dependencies and build package
WORKDIR /app/frontend
RUN npm install -g typescript vite
RUN npm install && npm run build

# Use Nginx to serve the frontend
FROM nginx:alpine

# Copy the build output to the Nginx HTML directory
COPY --from=build /app/frontend/dist /usr/share/nginx/html

# Copy custom Nginx configuration
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]