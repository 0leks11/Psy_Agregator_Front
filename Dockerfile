# Psy_Agregator_Front/Dockerfile

# --- Этап сборки (Build Stage) ---
    FROM node:18-alpine as build

    WORKDIR /app
    
    # Копируем package.json и lock-файл
    COPY package.json package-lock.json ./
    # Или yarn.lock, если используете yarn:
    # COPY package.json yarn.lock ./
    
    # Устанавливаем зависимости строго по lock-файлу
    RUN npm ci
    # Или для yarn:
    # RUN yarn install --frozen-lockfile
    
    # Копируем остальной код приложения
    COPY . .
    
    # Устанавливаем переменную окружения для URL бэкенда (ВАЖНО!)
    # Это значение будет "зашито" в статические файлы при сборке.
    # Используйте ARG, чтобы передать значение при сборке образа.
    ARG VITE_API_URL=/api # Значение по умолчанию (или для локальной сборки)
    ENV VITE_API_URL=$VITE_API_URL
    
    # Собираем production-ready статику
    RUN npm run build
    
    # --- Этап раздачи (Serve Stage) ---
    FROM nginx:1.25-alpine
    
    # Копируем собранные файлы из этапа сборки в директорию Nginx
    COPY --from=build /app/dist /usr/share/nginx/html
    
    # Копируем кастомную конфигурацию Nginx (см. ниже)
    COPY nginx.conf /etc/nginx/conf.d/default.conf
    
    # Открываем стандартный порт HTTP
    EXPOSE 80
    
    # Запускаем Nginx
    CMD ["nginx", "-g", "daemon off;"]