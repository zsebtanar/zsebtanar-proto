import * as functions from 'firebase-functions'
import * as firebaseAdmin from 'firebase-admin'

export const admin = firebaseAdmin.initializeApp(functions.config().firebase)
