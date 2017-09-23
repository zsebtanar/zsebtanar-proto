import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import checkExercise from './src/endpoints/checkExercise'
import createThumbnail from './src/storage/createThumbnail'
import { onWritePrivateExercise } from './src/database/exercise'
import getNextHint from './src/endpoints/getNextHint'

admin.initializeApp(functions.config().firebase)

/**
 * HTTP endpoints
 */

exports.checkExercise = functions.https.onRequest(checkExercise(admin))

exports.getNextHint = functions.https.onRequest(getNextHint(admin))

/**
 * Database functions
 */
exports.finalizeExercise = functions.database
  .ref('/exercise/private/{exerciseId}')
  .onWrite(onWritePrivateExercise(admin))

/**
 * Storage functions
 */
exports.generateThumbnail = functions.storage.object().onChange(createThumbnail(admin))
