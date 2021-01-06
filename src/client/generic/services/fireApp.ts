import fb from 'firebase/app'

import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/performance'
import 'firebase/analytics'

export const app = fb.initializeApp(__CONFIG__.firebase)
export const auth = fb.auth()
export const db = fb.firestore()
export const perf = fb.performance()
export const analytics = fb.analytics()

export const firebase = fb

fb.firestore().enablePersistence()
