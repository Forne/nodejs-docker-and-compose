FROM node:16-alpine as base

WORKDIR /var/www/app

FROM base as deps

COPY package*.json ./
RUN npm ci --omit=dev

FROM deps as build
COPY . .
RUN npm ci
RUN npm run build

FROM base as final

USER node

COPY --from=deps /var/www/app/package*.json ./
COPY --from=deps /var/www/app/node_modules ./node_modules
COPY --from=build /var/www/app/dist ./dist

# Default env values
ENV NODE_ENV production
EXPOSE 4000

CMD npm run start:prod
