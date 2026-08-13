FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci
COPY . .
ARG VITE_API_URL=https://ayuda-animal-murcia-web.onrender.com/vidanimal
ARG VITE_IMGBB_KEY
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_IMGBB_KEY=$VITE_IMGBB_KEY

RUN npm run build

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
