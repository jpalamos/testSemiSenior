FROM node:20.11.1-alpine
# It is a best practice to use the /usr/src/app directory
WORKDIR /usr/src/app

# Copy package.json, package-lock.json
COPY package*.json ./

# Install dependencies.
RUN npm install --no-progress

# Bundle app source
COPY . .

# Define environment variables
#RUN cp -rf .env.docker .env

# Display directory structure
# RUN ls -l

# Expose API port
EXPOSE 3003

# Run the web service on container startup
CMD [ "npm", "start" ]