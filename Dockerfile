# Psy_Agregator_Front/Dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .

# VITE_API_URL будет передан как build-arg из docker-compose.yml
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL} 
# Устанавливаем его как ENV переменную для процесса сборки #

RUN npm run build

FROM nginx:1.25-alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf 
# Убедитесь, что nginx.conf лежит рядом с Dockerfile
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]