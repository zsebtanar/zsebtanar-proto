const functions = require('firebase-functions')
const admin = require('firebase-admin')
const checkExercise = require('./src/endpoints/checkExercise')
const getNextHint = require('./src/endpoints/getNextHint')
const exercisePrivateWrite = require('./src/database/exercisePrivateWrite')
const createThumbnail = require('./src/storage/createThumbnail')

admin.initializeApp(functions.config().firebase)

exports.checkExercise = functions
  .https
  .onRequest(checkExercise(admin))

exports.getNextHint = functions
  .https
  .onRequest(getNextHint(admin))

exports.finalizeExercise = functions
  .database
  .ref('/exercise/{exerciseId}/private')
  .onWrite(exercisePrivateWrite(admin))

exports.generateThumbnail = functions
  .storage
  .object()
  .onChange(createThumbnail(admin))
