import { isNil, map, not, pipe, prop, values } from 'ramda'
import axios from 'axios'
import { resolveSnapshot } from '../../util/firebase'
import { assert } from '../../util/fn'

const DB = window.firebase.database()
const Exercises = DB.ref('exercise')

const notFound = assert(pipe(isNil, not), 'A kért feladat nem létezik.')

export function getPublicExercise (uid) {
  return Exercises
    .child(uid)
    .once('value')
    .then(pipe(resolveSnapshot, notFound, prop('public')))
}

export function getPrivateExercise (uid) {
  return Exercises
    .child(uid)
    .once('value')
    .then(pipe(resolveSnapshot, notFound, prop('private')))
}

export function getAllPrivateExercises () {
  return Exercises
    .once('value')
    .then(pipe(resolveSnapshot, values, map(prop('private'))))
}

export function createExercise (data) {
  const _key = Exercises.push().key
  const now = new Date()
  return Exercises
    .child(_key)
    .child('private')
    .update({
      ...data,
      _key,
      _created: now,
      _updated: now
    })
}

export function updateExercise (key, data) {
  return Exercises
    .child(key)
    .child('private')
    .update({
      ...data,
      _updated: new Date()
    })
}

export function removeExercise (key) {
  return Exercises
    .child(key)
    .remove()
}

export function checkSolution (key, solutions) {
  return axios
    .post(`${__FN_PATH__}api/check-exercise`, {key, solutions})
}

export function getHint (key, hint) {
  return axios
    .get(`${__FN_PATH__}api/get-next-hint`, {params: {key, hint}})
}
