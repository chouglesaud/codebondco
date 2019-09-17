FROM node:latest

WORKDIR /src

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 443 

CMD ["npm","start"]
