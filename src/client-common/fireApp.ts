import { initializeApp } from 'firebase/app'

import * as fbAuth from 'firebase/auth'
import * as fbDB from 'firebase/database'

export const fireApp = initializeApp(__CONFIG__.firebase)
export const auth = fbAuth
export const db = fbDB
