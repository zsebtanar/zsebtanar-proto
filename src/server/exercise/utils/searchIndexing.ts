import { getClient } from '../../utils/search/algolia'
import { unTokeniseMarkdown } from '../../utils/search/markdown'
import { interpretExerciseMarkdown } from '../../utils/pocketLisp'
import { SaveObjectResponse } from '@algolia/client-search'
import { ExerciseDoc, ExerciseState } from 'shared/exercise/types'
import { ClassificationSummaryDoc } from '../../../shared/classification/type'

type StoreType = 'summary' | 'admin'

const getExerciseIndex = (store: StoreType) => getClient().initIndex(`exercise-${store}`)

export async function indexExercise(
  id: string,
  exercise: ExerciseDoc,
  classifications: ClassificationSummaryDoc,
): Promise<SaveObjectResponse[]> {
  const data = await getIndexData(exercise, classifications)
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
  await getExerciseIndex('admin').clearObjects()
  await getExerciseIndex('summary').clearObjects()
  return
}

const getIndexData = async (exercise: ExerciseDoc, classifications: ClassificationSummaryDoc) => {
  const classificationLabels = exercise.classifications
    .map((id) => classifications?.[id])
    .filter(Boolean)

  const description = interpretExerciseMarkdown(exercise.script, exercise.description)
  const searchableDescription = interpretExerciseMarkdown(
    exercise.script,
    unTokeniseMarkdown(exercise.description),
  )

  return {
    lang: exercise.lang,
    description,
    searchableDescription,
    classifications: exercise.classifications,
    classificationLabels,
    state: exercise.state,
    difficulty: exercise.difficulty,
  }
}
