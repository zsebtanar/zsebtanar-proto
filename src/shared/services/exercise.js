import { isNil, not, pipe, prop, values } from 'ramda'
import { resolveSnapshot } from '../util/firebase'
import { assert } from '../util/fn'
import { cloudFnDelete, cloudFnGet, cloudFnPost } from 'shared/util/firebase'

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
  return cloudFnPost(`exercise`, data)
}

export function updateExercise(key, data) {
  return cloudFnPost(`exercise/${key}`, data)
}

export function removeExercise(key) {
  return cloudFnDelete(`exercise/${key}`)
}

export function checkSolution(key, solutions) {
  return cloudFnPost('exercise/check', { key, solutions })
}

export function getHint(key, hint) {
  return cloudFnGet('exercise/getNextHint', { key, hint }).then(prop('data'))
}
