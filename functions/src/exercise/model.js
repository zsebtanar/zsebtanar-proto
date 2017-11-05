import { pick, keys } from 'ramda'
import { admin } from '../utils/fb-utils'

const PUBLIC_PROPS = ['_key', '_created', '_updated', 'classification', 'description', 'controls']
const DB = admin.database()
const PrivateExercise = DB.ref('exercise/private')
const PublicExercise = DB.ref('exercise/public')

export const newPrivateExerciseKey = () => PrivateExercise.push().key

export const getPrivateExercise = key => PrivateExercise.child(key).once('value')

export const savePrivateExercise = (key, data) => PrivateExercise.child(key).update(data)

export const savePublicExercise = (key, data) =>
  PublicExercise.child(key).set({
    ...pick(PUBLIC_PROPS, data),
    hintCount: keys(data.hints).length
  })

export const removePublicExercise = key => PublicExercise.child(key).remove()

export const removeExercise = key =>
  Promise.all([PrivateExercise.child(key).remove(), removePublicExercise(key)])
