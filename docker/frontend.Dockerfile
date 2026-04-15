FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY frontend/package*.json ./frontend/
COPY shared/package*.json ./shared/

# Install dependencies
COPY . .
RUN npm install
RUN npm run build:shared
RUN npm run build:frontend

FROM nginx:alpine
COPY --from=builder /app/frontend/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
