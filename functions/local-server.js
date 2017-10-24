const mock = require('mock-require')

mock('firebase-functions', './mocks/firebase-functions')
mock('firebase-admin', './mocks/firebase-admin')

const app = require('./src/api').default

app.listen(3000, function() {
  console.log('Zsebtanár local API app listening on port 3000!')
})
