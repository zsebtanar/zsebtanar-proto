import * as express from 'express'
import { admin } from '../../utils/fb-utils'
import { unTokeniseMarkdown } from '../../utils/markdown'
import {
  __,
  curry,
  defaultTo,
  difference,
  evolve,
  juxt,
  lensProp,
  mapObjIndexed,
  mergeAll,
  omit,
  over,
  pathOr,
  pick,
  pipe,
  prop,
  union,
  values,
  keys,
  map
} from 'ramda'
import validateFirebaseIdToken from '../../middlewares/firebaseToken'
import preFetch from '../../middlewares/preFetchDB'
import { removeExerciseIndex, indexExercise } from './search'

const PUBLIC_PROPS = ['_key', '_created', '_updated', 'classification', 'description', 'controls']
const DB = admin.database()
const PrivateExercise = DB.ref('exercise/private')
const PublicExercise = DB.ref('exercise/public')

const route = express.Router()
export default route

route.use(validateFirebaseIdToken)
route.use(preFetch('classifications/'))

// create
route.post('/', (req, res) => {
  const key = PrivateExercise.push().key
  const now = new Date()

  const data = {
    ...req.body,
    _key: key,
    _created: now,
    _createdBy: req.user.uid,
    _updated: now,
    _updatedBy: req.user.uid
  }

  return Promise.all([
    indexExercise(key, getIndexData(data, req.classifications.data)),
    savePrivateExercise(key, data),
    updateAllClassification(req.classifications, key, data)
  ])
    .then(() => res.status(201).send())
    .catch(error => {
      console.error(error)
      res.status(500).send('Unexpected error')
    })
})

// Update
route.post('/:exerciseId', (req, res) => {
  const key = req.params.exerciseId
  const data = {
    ...req.body,
    _key: key,
    _updated: new Date(),
    _updatedBy: req.user.uid
  }

  return Promise.all([
    indexExercise(key, getIndexData(data, req.classifications.data)),
    savePrivateExercise(key, data),
    updateAllClassification(req.classifications, key, data)
  ])
    .then(() => res.status(204).send())
    .catch(error => {
      console.error(error)
      res.status(500).send('Unexpected error')
    })
})

// Remove
route.delete('/:exerciseId', (req, res) => {
  const key = req.params.exerciseId
  Promise.all([
    removeExerciseIndex(key),
    removeExercise(key),
    updateAllClassification(req.classifications, key, {})
  ])
    .then(() => res.status(204).send())
    .catch(error => {
      console.error(error)
      res.status(500).send('Unexpected error')
    })
})

//-------------------

const savePrivateExercise = (key, data) => PrivateExercise.child(key).update(data)

const savePublicExercise = (key, data) =>
  PublicExercise.child(key).set({
    ...pick(PUBLIC_PROPS, data),
    hintCount: keys(data.hints || {}).length || 0
  })

const removeExercise = key =>
  Promise.all([PrivateExercise.child(key).remove(), PublicExercise.child(key).remove()])

const updateAllClassification = (classifications, key, original) => {
  const grades = pathOr([], ['classification', 'grade'], original)
  const subjects = pathOr([], ['classification', 'subject'], original)
  const topics = pathOr([], ['classification', 'topic'], original)
  const tags = pathOr([], ['classification', 'tags'], original)

  return classifications.ref.update(
    evolve(
      {
        grade: updateClassification(key, grades),
        subject: pipe(
          updateClassification(key, subjects),
          mapObjIndexed(evolve({ topic: updateClassification(key, topics) }))
        ),
        tags: updateClassification(key, tags)
      },
      classifications.data
    )
  )
}

const exerciseL = lensProp('exercise')
const defArray = defaultTo([])

const updateClassification = curry((exKey, selectedItems, object) =>
  pipe(
    juxt([
      pipe(pick(selectedItems), mapObjIndexed(over(exerciseL, union([exKey])))),
      pipe(
        omit(selectedItems),
        mapObjIndexed(over(exerciseL, pipe(defArray, difference(__, [exKey]))))
      )
    ]),
    mergeAll
  )(object)
)

const getIndexData = (exercise, classifications) => {
  const grades = pathOr([], ['classification', 'grade'], exercise)
  const subjects = pathOr([], ['classification', 'subject'], exercise)
  const topics = pathOr([], ['classification', 'topic'], exercise)
  const tags = pathOr([], ['classification', 'tags'], exercise)

  const classTopics = pipe(prop('subject'), values, map(prop('topic')), mergeAll)(classifications)

  const gradeList = pipe(prop('grade'), pick(grades), values)(classifications)
  return {
    grade: map(prop('name'), gradeList),
    subject: pipe(prop('subject'), pick(subjects), values, map(prop('name')))(classifications),
    topic: pipe(pick(topics), values, map(prop('name')))(classTopics),
    tags: pipe(prop('tags'), pick(tags), values, map(prop('name')))(classifications),
    difficulty: exercise.difficulty,
    description: exercise.description,
    searchableDescription: unTokeniseMarkdown(exercise.description)
  }
}
