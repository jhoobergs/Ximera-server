FROM node:11
RUN apt-get update
RUN apt-get install -y curl git libcurl4-gnutls-dev libgit2-dev libssl-dev
WORKDIR /usr/var/server
COPY package*.json /usr/var/server/
RUN npm install --unsafe-perm
COPY . /usr/var/server
RUN npm run build
CMD npm run start
