FROM node:latest as build
WORKDIR /app
COPY src/package.json .
RUN yarn install
COPY . .
RUN yarn run build
FROM nginx
COPY --from=build /app/build /usr/share/nginx/html