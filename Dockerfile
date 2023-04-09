FROM node:16.20 AS development

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD [ "npm", "run", "start:dev" ]

###################
# BUILD FOR PRODUCTION
###################

FROM node:16.20 AS build

WORKDIR /usr/src/app

COPY package*.json ./

COPY --from=development /usr/src/app/node_modules ./node_modules

COPY . .

WORKDIR /usr/src/app

RUN npm run build

ENV NODE_ENV production

RUN npm ci --only=production && npm cache clean --force

###################
# PRODUCTION
###################

FROM node:16.20 AS production

ENV NODE_ENV production

COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist

CMD ["node", "dist/main.js" ]