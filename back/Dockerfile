ARG NODE_VERSION=20

###################
# BUILD
###################
FROM node:${NODE_VERSION}-alpine AS build

WORKDIR /usr/src/app

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

COPY package.json pnpm-lock.yaml ./

RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile

COPY . .

RUN pnpm run build

RUN pnpm prune --prod

###################
# PRODUCTION
###################
FROM node:${NODE_VERSION}-alpine

RUN apk add --no-cache tini

WORKDIR /usr/src/app

COPY --from=build --chown=node:node /usr/src/app/node_modules ./node_modules
COPY --from=build --chown=node:node /usr/src/app/dist ./dist

USER node

CMD [ "/sbin/tini", "node", "dist/main.js" ]
