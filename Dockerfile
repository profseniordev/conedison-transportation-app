FROM node:12.18.4-slim as builder
RUN mkdir /app
WORKDIR /app
COPY . .

ARG build_env="prod"
ENV build_env="${build_env}"\
        REACT_APP_API_ENDPOINT='http://localhost:8443/api' \
	SKIP_PREFLIGHT_CHECK=false \
	REACT_APP_NOTIFICATIONS_ADDRESS="http://localhost:7777" \
	REACT_APP_GOOGLE_MAP_AIP_KEY="AIzaSyCIpyQSZBH9rZcK_jva3Dr_2TLr7RHhlyw" \
	REACT_APP_MAP_CENTER_LAT=40.754102 \
	REACT_APP_MAP_CENTER_LNG=-73.983672 \
	REACT_APP_CLIENT_DOMAIN="http://localhost" 

RUN yarn install
RUN yarn run build
RUN echo $REACT_APP_CLIENT_DOMAIN

FROM nginx:1.15-alpine

LABEL description="Coned web"

RUN apk add --no-cache --update bash curl && \
    rm -rf /var/cache/apk/*

ARG app_name=loan-backoffice
ARG build_version="1.0.2-edge"

ENV REACT_APP_EVALUATION_URL=""

EXPOSE 80

HEALTHCHECK --interval=1m --timeout=3s \
    CMD curl --fail http://127.0.0.1 || exit 1

COPY  --from=builder /app/build /usr/share/nginx/html
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
