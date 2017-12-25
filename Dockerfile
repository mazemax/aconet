FROM node:carbon

# install nmap
RUN apt-get update
RUN apt-get install -y libssl-dev build-essential
RUN wget https://nmap.org/dist/nmap-7.01.tar.bz2 && bzip2 -cd nmap-7.01.tar.bz2 | tar xvf -
RUN cd nmap-7.01 && ./configure && make && make install
RUN nmap -v

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY ./acoapp/package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm install --only=production

# Bundle app source
COPY ./acoapp .

EXPOSE 8000-9000
CMD [ "npm", "start" ]
