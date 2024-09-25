FROM node:16-alpine as deps

WORKDIR /var/www/app
COPY package*.json ./
RUN npm ci

FROM deps as build
COPY . .
RUN npm run build

FROM nginx:latest as final

COPY --from=build /var/www/app/build /usr/share/nginx/html
COPY ./nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 8081
