FROM node:6.11.1-slim

RUN mkdir -p home/node/app/

WORKDIR home/node/app/

COPY bin/functions bin/functions
COPY ./.firebaserc .firebaserc
COPY ./firebase.json firebase.json
COPY ./database.rules.json database.rules.json

RUN npm install firebase-tools
RUN cd bin/functions && npm install

RUN ./node_modules/.bin/firebase login --token 1/__gE8ZJsEbDqAiCvmfUj6yx8d-SYnAuc-uVhb8MAP6AtUFyc9Ez3Fqeh4AyqkcjT

CMD ["./node_modules/.bin/firebase","serve", "--only", "functions"]

# ./node_modules/.bin/firebase serve --only functions --token 1/__gE8ZJsEbDqAiCvmfUj6yx8d-SYnAuc-uVhb8MAP6AtUFyc9Ez3Fqeh4AyqkcjT