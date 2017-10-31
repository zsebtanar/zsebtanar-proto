import { getClient } from '../../utils/algolia'

const getIndex = () => getClient().initIndex('exercises')

export function indexExercise(id, content) {
  return getIndex().saveObject({
    objectID: id,
    ...content
  })
}

export function removeExerciseIndex(id) {
  return getIndex().deleteObjects([id])
}
