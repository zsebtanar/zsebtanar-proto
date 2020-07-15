import fb from 'firebase/app'

export const app = fb.initializeApp(__CONFIG__.firebase)
export const auth = fb.auth()
export const db = fb.storage()
export const perf = fb.performance()
export const analytics = fb.analytics()

export const firebase = fb
