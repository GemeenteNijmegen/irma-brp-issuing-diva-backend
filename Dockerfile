FROM node:8.6

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json package-lock.json ./

RUN npm install

# Enable for live debugging in pod
RUN npm install -g nodemon

# Bundle app source
COPY . .

CMD [ "npm", "run" , "dev" ]
# CMD [ "npm", "run" , "prod" ]
