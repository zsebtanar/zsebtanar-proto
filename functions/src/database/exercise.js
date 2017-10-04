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
  map
} from 'ramda'
import { removeExerciseIndex, saveExercise } from '../search/exercise'
import Markdown from 'markdown-it/lib/index'
import katex from 'markdown-it-katex'

const PUBLIC_PROPS = ['_key', '_created', '_updated', 'classification', 'description', 'controls']

/**
 * onWrite /exercise/private/{exerciseId}
 */
export const onWritePrivateExercise = admin => event => {
  const key = event.params.exerciseId
  const classRef = admin.database().ref(`/classifications`)

  return classRef.once('value').then(snapshot => {
    const classifications = snapshot.val()
    // skip remove
    if (!event.data.exists()) {
      return Promise.all([
        removeExerciseIndex(key),
        removeExercise(event),
        updateAllClassification(classRef, classifications, key, {})
      ])
    }

    // create / update
    const original = event.data.val()

    return Promise.all([
      saveExercise(key, prepareIndex(original, classifications)),
      updateExercise(event, key, original),
      updateAllClassification(classRef, classifications, key, original)
    ])
  })
}

function updateExercise(event, key, original) {
  // copy public properties
  const publicData = pick(PUBLIC_PROPS, original)

  publicData.hintCount = Object.keys(pathOr({}, ['hints'], original)).length || 0

  return event.data.ref.parent.parent.child(`public/${key}`).set(publicData)
}

function removeExercise(event) {
  return event.data.ref.parent.remove()
}

const updateAllClassification = (classRef, classifications, key, original) => {
  const grades = pathOr([], ['classification', 'grade'], original)
  const subjects = pathOr([], ['classification', 'subject'], original)
  const topics = pathOr([], ['classification', 'topic'], original)
  const tags = pathOr([], ['classification', 'tags'], original)

  return classRef.update(
    evolve(
      {
        grade: updateClassification(key, grades),
        subject: pipe(
          updateClassification(key, subjects),
          mapObjIndexed(evolve({ topic: updateClassification(key, topics) }))
        ),
        tags: updateClassification(key, tags)
      },
      classifications
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

const prepareIndex = (exercise, classifications) => {
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
    searchableDescription: extractDescription(exercise.description)
  }
}

const extractDescription = description =>
  reduceTokenList(new Markdown({}).use(katex).parse(description))
    .join(' ')
    .replace(/\s+/g, ' ')

const reduceTokenList = tokenList =>
  tokenList.reduce((acc, i) => {
    if (i.type === 'text') return acc.concat(i.content)
    if (i.type === 'inline') return acc.concat(reduceTokenList(i.children))
    return acc
  }, [])
