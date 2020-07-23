FROM node:alpine

COPY ./ /opt/mc-bot

WORKDIR /opt/mc-bot

RUN npm i -g nodemon && \
  npm i && \
  npm run build && \
  npm prune --production

CMD ["nodemon", "./dist/index.js"]
