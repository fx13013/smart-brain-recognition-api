# Use official Node.js 20.x image as base
FROM node:20

# Set working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Install netcat-openbsd
RUN apt-get update && apt-get install -y netcat-openbsd

COPY wait-for-it.sh /app/wait-for-it.sh

CMD ["./wait-for-it.sh", "postgres", "5432", "--", "npm", "start"]
