import { fireStore } from '../../utils/firebase'
import { getClient } from '../../utils/search/algolia'
import { unTokeniseMarkdown } from '../../utils/search/markdown'
import { interpretExerciseMarkdown } from '../../utils/search/pocketLisp'
import { ExerciseSchemaType } from '../model'

export async function indexExercise(id: string, exercise: ExerciseSchemaType): Promise<void> {
  return getClient()
    .initIndex('exercises')
    .saveObject({
      objectID: id,
      ...(await getIndexData(exercise)),
    })
}

export function removeExerciseIndex(id: string): Promise<void> {
  return getClient().initIndex('exercises').deleteObjects([id])
}

const getIndexData = async (exercise: ExerciseSchemaType) => {
  const allClassifications = (
    await fireStore.collection('category').doc('classifications').get()
  ).data()

  const classificationLabels = exercise.classifications
    .map((id) => allClassifications?.[id])
    .filter(Boolean)

  const description = interpretExerciseMarkdown(exercise.script, exercise.description)
  const searchableDescription = interpretExerciseMarkdown(
    exercise.script,
    unTokeniseMarkdown(exercise.description),
  )

  return {
    classificationLabels,
    searchableDescription,
    classifications: exercise.classifications,
    state: exercise.state,
    difficulty: exercise.difficulty,
    description,
  }
}
