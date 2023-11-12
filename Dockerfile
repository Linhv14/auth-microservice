FROM node:21

WORKDIR /linhv/src/app

COPY package*.json ./

RUN npm install

COPY . .

CMD [ "npm", "run", "start:prod"]