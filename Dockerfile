FROM node:20

# Install netcat
RUN apt-get update && apt-get install -y netcat-openbsd

# Set the working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Ensure wait-for-it.sh is executable
COPY wait-for-it.sh /app/wait-for-it.sh
RUN chmod +x /app/wait-for-it.sh

# Expose the port the app runs on
EXPOSE 3000

# Define the command to run the application
CMD ["./wait-for-it.sh", "postgres:5432", "--", "npm", "start"]
