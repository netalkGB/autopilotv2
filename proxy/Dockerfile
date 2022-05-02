FROM node:16-bullseye

COPY ./ ./app

WORKDIR /app

RUN yarn

RUN yarn build

EXPOSE 53000 53000/tcp

CMD [ "yarn", "start"]
