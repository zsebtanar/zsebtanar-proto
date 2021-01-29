import { fireStore } from '../../utils/firebase'
import { getClient } from '../../utils/search/algolia'
import { unTokeniseMarkdown } from '../../utils/search/markdown'
import { interpretExerciseMarkdown } from '../../utils/search/pocketLisp'
import { SaveObjectResponse } from '@algolia/client-search'
import { ExerciseDoc, ExerciseState } from 'shared/exercise/types'

type StoreType = 'summary' | 'admin'

const getExerciseIndex = (store: StoreType) => getClient().initIndex(`exercises-${store}`)

export async function indexExercise(
  id: string,
  exercise: ExerciseDoc,
): Promise<SaveObjectResponse[]> {
  const data = await getIndexData(exercise)
  const promises = [getExerciseIndex('admin').saveObject({ objectID: id, ...data })]
  if (exercise.state === ExerciseState.Public) {
    promises.push(getExerciseIndex('summary').saveObject({ objectID: id, ...data }))
  }
  return await Promise.all(promises)
}

export async function removeExerciseIndex(id: string, store?: StoreType): Promise<void> {
  if (!store) {
    await removeExerciseIndex(id, 'admin')
    await removeExerciseIndex(id, 'summary')
  } else {
    await getExerciseIndex(store).deleteObjects([id])
  }
  return
}

export async function clearPublicExerciseIndexes(): Promise<void> {
  await getExerciseIndex('summary').clearObjects()
  return
}

const getIndexData = async (exercise: ExerciseDoc) => {
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
