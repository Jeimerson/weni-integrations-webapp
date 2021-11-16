FROM node:14.17.4-alpine3.14 as builder

ENV WORKDIR /app
WORKDIR $WORKDIR

RUN apk update && apk add git yarn

COPY package.json .
COPY yarn.lock .

RUN yarn install

COPY . .

ARG VUE_APP_API_BASE_URL
ARG VUE_APP_USE_SENTRY
ARG VUE_APP_SENTRY_DSN

ENV VUE_APP_API_BASE_URL $VUE_APP_API_BASE_URL
ENV VUE_APP_USE_SENTRY $VUE_APP_USE_SENTRY
ENV VUE_APP_SENTRY_DSN $VUE_APP_SENTRY_DSN


RUN yarn build

FROM nginx

COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /app/dist /usr/share/nginx/html