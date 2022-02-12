FROM node:16
WORKDIR /
COPY package*.json ./
COPY tsconfig.json ./
RUN npm install
RUN npm install typescript -g
COPY . .
EXPOSE 3000
RUN tsc server.ts
# ADD start.sh /
CMD ["node", "server.ts"]