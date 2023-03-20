# Use the official Node.js image as the base image
FROM node:18.12.1

# Set the working directory inside the container
WORKDIR /app

# Copy the source code to the container
COPY . .

# Install the dependencies
RUN npm install

# Start the server with node when the container starts
CMD ["node", "app.js"]