FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
COPY backend/package*.json ./backend/
COPY shared/package*.json ./shared/

COPY . .
RUN npm install
RUN npm run build:shared
RUN npm run build:backend

WORKDIR /app/backend
EXPOSE 5000
CMD ["npm", "start"]
