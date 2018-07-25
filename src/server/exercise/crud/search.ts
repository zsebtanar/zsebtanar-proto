import { getClient } from '../../utils/algolia'
import { unTokeniseMarkdown } from '../../utils/markdown'
import { map, mergeAll, pathOr, pick, pipe, prop, values } from 'ramda'

const getIndex = () => getClient().initIndex('exercises')

export function indexExercise(id, exercise, classifications) {
  return getIndex().saveObject({
    objectID: id,
    ...getIndexData(exercise, classifications)
  })
}

export function removeExerciseIndex(id) {
  return getIndex().deleteObjects([id])
}

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
