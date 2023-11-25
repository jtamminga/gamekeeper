FROM node:lts-bullseye-slim

# ENV NODE_ENV=production
ENV PORT=3000
ENV DB_PATH=test

WORKDIR /usr/src/app

# copy needed items only
COPY package.json .
COPY yarn.lock .
COPY packages/core ./packages/core
COPY packages/db ./packages/db
COPY apps/api ./apps/api

RUN yarn workspace api install --frozen-lockfile
RUN yarn workspace api build

EXPOSE 3000

CMD ["yarn", "workspace", "api", "start"]
