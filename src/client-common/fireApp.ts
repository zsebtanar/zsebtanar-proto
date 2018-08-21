import * as fb from 'firebase/app'

import 'firebase/auth'
import 'firebase/database'

export const app = fb.initializeApp(__CONFIG__.firebase)
export const firebase = fb
