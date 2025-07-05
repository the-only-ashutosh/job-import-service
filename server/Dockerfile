# Dockerfile
FROM node:18-alpine

WORKDIR /

COPY package*.json ./
RUN npm install

COPY . .

CMD ["npm", "run", "start"]  # overridden for worker service
