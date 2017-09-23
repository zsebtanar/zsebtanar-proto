import { isNil, not, pipe, values } from 'ramda'
import axios from 'axios'
import { resolveSnapshot } from '../util/firebase'
import { assert } from '../util/fn'

const DB = window.firebase.database()
const Exercises = DB.ref('exercise')

const notFound = assert(pipe(isNil, not), 'A kért feladat nem létezik.')

export function getPublicExercise(uid) {
  return Exercises.child(`public/${uid}`)
    .once('value')
    .then(pipe(resolveSnapshot, notFound))
}

export function getPrivateExercise(uid) {
  return Exercises.child(`private/${uid}`)
    .once('value')
    .then(pipe(resolveSnapshot, notFound))
}

export function getAllPrivateExercises() {
  return Exercises.child('private')
    .once('value')
    .then(pipe(resolveSnapshot, values))
}

export function selectPublicExercisesById(ids) {
  return Promise.all(ids.map(getPublicExercise))
}

export function createExercise(data) {
  const _key = Exercises.push().key
  const now = new Date()
  return Exercises.child('private')
    .child(_key)
    .update({
      ...data,
      _key,
      _created: now,
      _updated: now
    })
}

export function updateExercise(key, data) {
  return Exercises.child('private')
    .child(key)
    .update({
      ...data,
      _updated: new Date()
    })
}

export function removeExercise(key) {
  return Exercises.child('private')
    .child(key)
    .remove()
}

export function checkSolution(key, solutions) {
  return axios.post(`${__FN_PATH__}check-exercise`, { key, solutions })
}

export function getHint(key, hint) {
  return axios.get(`${__FN_PATH__}get-next-hint`, { params: { key, hint } })
}
