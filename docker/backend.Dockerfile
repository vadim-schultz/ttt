# Set the base image
FROM ubuntu:24.04

# Set the working directory to /app
WORKDIR /app

# Install required modules
RUN apt-get --yes update && apt-get --yes install python3 python3-pip python3-venv git

# Create a non-root user and group for security
RUN groupadd -r user && useradd --no-log-init -r -g user user

# Copy backend directory to /app/backend
COPY backend /app/backend

# .git/ is required for version resolution
COPY .git /app/.git

# Change to /app/ directory
WORKDIR /app/

# Activate venv and install package
RUN chown --recursive user:user /app

# Switch to the non-root user
USER user

RUN python3 -m venv venv && . ./venv/bin/activate && pip install ./backend/

# Expose the port the app runs on (8000 by default for Litestar)
EXPOSE 8000

# Run the app from the package entry point
ENTRYPOINT ["/bin/bash", "-c"]
CMD [". ./venv/bin/activate && run-backend"]
