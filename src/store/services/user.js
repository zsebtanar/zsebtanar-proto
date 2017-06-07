import {pick} from 'ramda'
const DB = window.firebase.database()

const Users = DB.ref('users')

export function getUser(uid) {
  return Users.child(uid).once('value').then(s => s.val())
}

export function createUser(uid, data) {
  return Users.child(uid)
    .update({...pick(['name'], data), _key: uid})
}
