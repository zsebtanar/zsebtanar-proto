const functions = require('firebase-functions')
const admin = require('firebase-admin')
const checkExercise = require('./endpoints/checkExercise')
const getNextHint = require('./endpoints/getNextHint')
const exercisePrivateWrite = require('./database/exercisePrivateWrite')

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
