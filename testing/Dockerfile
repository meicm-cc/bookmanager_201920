FROM node

RUN mkdir /var/tests

COPY ./ /var/tests

WORKDIR /var/tests

RUN npm install

CMD ["npm", "run", "test"]