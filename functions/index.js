const functions = require('firebase-functions')
const admin = require('firebase-admin')
const checkExercise = require('./src/endpoints/checkExercise')
const getNextHint = require('./src/endpoints/getNextHint')
const {onWritePrivateExercise} = require('./src/database/exercise')
const createThumbnail = require('./src/storage/createThumbnail')

admin.initializeApp(functions.config().firebase)

/**
 * HTTP endpoints
 */

exports.checkExercise = functions
  .https
  .onRequest(checkExercise(admin))

exports.getNextHint = functions
  .https
  .onRequest(getNextHint(admin))

/**
 * Database functions
 */
exports.finalizeExercise = functions
  .database
  .ref('/exercise/{exerciseId}/private')
  .onWrite(onWritePrivateExercise(admin))

/**
 * Storage functions
 */
exports.generateThumbnail = functions
  .storage
  .object()
  .onChange(createThumbnail(admin))
