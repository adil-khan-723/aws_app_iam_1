FROM node:25-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

COPY . ./

CMD ["node", "app.js"]

