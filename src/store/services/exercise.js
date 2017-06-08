import {values} from 'ramda'
import axios from 'axios'
import {reseolveSnapshot} from '../../util/firebase'

const DB = window.firebase.database()
const Exercises = DB.ref('exercise')

export function getExercise(uid) {
  return Exercises
    .child(uid)
    .once('value')
    .then(reseolveSnapshot)
}

export function getAllExercises() {
  return Exercises
    .once('value')
    .then(reseolveSnapshot)
    .then(values)
}

export function createExercise(data) {
  const _key = Exercises.push().key
  return Exercises
    .child(_key)
    .update({...data, _key})
}

export function sheckSolution(key, solution) {
  return axios
    .get(`${__FN_PATH__}api/check-exercise`, {params: {key, solution, t:Date.now()}})
}