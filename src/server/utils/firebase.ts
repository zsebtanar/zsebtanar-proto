import * as functions from 'firebase-functions'
import * as firebaseAdmin from 'firebase-admin'
import 'firebase-functions'

export const admin = firebaseAdmin.initializeApp(functions.config().firebase)
