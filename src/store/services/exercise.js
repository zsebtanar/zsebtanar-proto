import { map, pipe, prop, values } from 'ramda'
import axios from 'axios'
import { reseolveSnapshot } from '../../util/firebase'

const DB = window.firebase.database()
const Exercises = DB.ref('exercise')

export function getPublicExercise (uid) {
  return Exercises
    .child(uid)
    .once('value')
    .then(pipe(reseolveSnapshot, prop('public')))
}

export function getPrivateExercise (uid) {
  return Exercises
    .child(uid)
    .once('value')
    .then(pipe(reseolveSnapshot, prop('private')))
}

export function getAllPrivateExercises () {
  return Exercises
    .once('value')
    .then(pipe(reseolveSnapshot, values, map(prop('private'))))
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
