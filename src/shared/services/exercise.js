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

export const createExercise = data => cloudFnPost(`exercise`, data, { withToken: true })

export const updateExercise = (key, data) =>
  cloudFnPost(`exercise/${key}`, data, { withToken: true })

export const removeExercise = key => cloudFnDelete(`exercise/${key}`, { withToken: true })

export const checkSolution = (key, solutions) => cloudFnPost('exercise/check', { key, solutions })

export const getHint = (key, hint) =>
  cloudFnGet('exercise/getNextHint', { key, hint }).then(prop('data'))
