import {pipe, values, prop, map} from 'ramda'
import axios from 'axios'
import {reseolveSnapshot} from '../../util/firebase'

const DB = window.firebase.database()
const Exercises = DB.ref('exercise')

export function getPrivateExercise(uid) {
  return Exercises
    .child(uid)
    .once('value')
    .then(pipe(reseolveSnapshot, prop('private')))
}

export function getAllPrivateExercises() {
  return Exercises
    .once('value')
    .then(pipe(reseolveSnapshot, values, map(prop('private'))))
}

export function createExercise(data) {
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

export function updateExercise(key, data) {
  return Exercises
    .child(key)
    .child('private')
    .update({
      ...data,
      _updated: new Date(),
    })
}

export function checkSolution(key, solution) {
  return axios
    .get(`${__FN_PATH__}api/check-exercise`, {params: {key, solution, t:Date.now()}})
}