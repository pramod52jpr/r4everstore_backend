FROM node
WORKDIR /r4everstore_backend
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8080
CMD ["npm", "start"]