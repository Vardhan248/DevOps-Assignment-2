# 1. Use official Node.js image
FROM node:18-slim

# 2. Set the working directory
WORKDIR /usr/src/app

# 3. Copy package files first and install dependencies
COPY package*.json ./
RUN npm install --production

# 4. Copy the rest of your source code
COPY . .

# 5. Expose port 3000 (same as in server.js)
EXPOSE 3000

# 6. Start the app
CMD ["npm", "start"]
