FROM node:14.4.0-alpine as base

ARG NODE_ENV
ARG PORT
ARG REACT_APP_API_URL
ARG REACT_APP_DOCUSIGN_REDIRECT_URL
ARG REACT_APP_DOCUSIGN_OAUTH_URL
ARG REACT_APP_DOCUSIGN_INTEGRATION_KEY

ENV NODE_ENV=$NODE_ENV
ENV PORT=$PORT
ENV REACT_APP_API_URL=$REACT_APP_API_URL
ENV REACT_APP_DOCUSIGN_REDIRECT_URL=$REACT_APP_DOCUSIGN_REDIRECT_URL
ENV REACT_APP_DOCUSIGN_OAUTH_URL=$REACT_APP_DOCUSIGN_OAUTH_URL
ENV REACT_APP_DOCUSIGN_INTEGRATION_KEY=$REACT_APP_DOCUSIGN_INTEGRATION_KEY

RUN apk add --update --no-cache alpine-sdk python

WORKDIR /lawing-admin/

COPY package.json yarn.lock jsconfig.json .eslintignore .eslintrc config-overrides.js prettier.config.js /lawing-admin/

RUN yarn --pure-lockfile

COPY src /lawing-admin/src/

COPY public /lawing-admin/public/

EXPOSE 3000

FROM base as development

CMD yarn start

FROM base as production

CMD yarn start
