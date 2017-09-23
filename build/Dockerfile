FROM mhart/alpine-node:6.11.1

COPY bin/functions bin/functions
COPY .firebaserc .firebaserc
COPY firebase.json firebase.json
COPY database.rules.json database.rules.json

RUN npm install firebase-tools
RUN cd bin/functions && npm install

CMD ["./node_modules/.bin/firebase","serve", "--only", "functions"]