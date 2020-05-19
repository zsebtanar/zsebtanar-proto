import * as fb from 'firebase/app'

import 'firebase/auth'
import 'firebase/database'
import 'firebase/firestore'

export const app = fb.initializeApp(__CONFIG__.firebase)
if (__SERVER_ENV__ !== 'emulator') {
  fb.functions().useFunctionsEmulator('http://localhost:5001')
}
export const firebase = fb
