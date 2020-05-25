import * as functions from 'firebase-functions'
import * as firebaseAdmin from 'firebase-admin'
import 'firebase-functions'

console.log(functions.config().firebase)
export const admin = firebaseAdmin.initializeApp(functions.config().firebase)

const db = admin.firestore()

export const fireStore = db
