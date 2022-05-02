FROM node:16-bullseye

COPY ./ ./app

WORKDIR /app

RUN yarn

RUN yarn build

EXPOSE 58000 58000/tcp

CMD [ "yarn", "start"]
