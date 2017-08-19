import { pick, pipe, values } from 'ramda'
import { resolveSnapshot } from '../util/firebase'

const DB = window.firebase.database()

const Users = DB.ref('users')

export const ROLE_USER = 0
export const ROLE_TEACHER = 500
export const ROLE_ADMIN = 1000

export function getUser (uid) {
  return Users.child(uid).once('value').then(s => s.val())
}

export function getAllUser () {
  return Users.once('value')
    .then(pipe(resolveSnapshot, values))
}

export function updateUser (uid, data) {
  return Users
    .child(uid)
    .update({...pick(['name', 'role', 'active'], data)})
}

export function createUser (uid, data) {
  return Users
    .child(uid)
    .update({
      ...pick(['name', 'email'], data),
      active: false,
      role: ROLE_USER,
      _key: uid,
      _created: new Date()
    })
}
