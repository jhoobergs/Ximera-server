FROM node:11
RUN apt-get update
RUN apt-get install -y curl git libcurl4-gnutls-dev libgit2-dev libssl-dev
WORKDIR /usr/var/server
COPY package*.json /usr/var/server/
RUN npm install
#RUN BUILD_ONLY=true npm install nodegit
COPY . /usr/var/server
CMD npm run start
