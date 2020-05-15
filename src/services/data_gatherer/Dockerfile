FROM node:14.2-alpine

RUN mkdir /srv/app

WORKDIR /srv/app

COPY . .

RUN npm config set package-lock false && npm install

EXPOSE 10000

CMD ["node", "index.js" ]
