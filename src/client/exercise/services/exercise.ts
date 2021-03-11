import { useCallback, useMemo } from 'react'
import {
  ExerciseModel,
  ExerciseState,
  ExerciseSummaryModel,
  UCUserAnswer,
} from 'shared/exercise/types'
import { LoadAndStoreModelAPI, useLoadAndStoreModel } from '../../generic/hooks/loadAndStoreModel'
import { Service } from 'client/generic/services/fireStoreBase'
import { FetchDataAPI, useFetchData } from 'client/generic/hooks/fetchData'
import { cloudFnPost } from 'client/generic/services/firebase'
import {
  FetchFirestoreListAPI,
  FetchFirestoreListOptions,
  useFetchFirestoreList,
} from '../../generic/hooks/fetchFirestoreList'
import { GridFilterOptions } from 'shared/generic/types'

export const exerciseSummaryDataService = new Service<ExerciseSummaryModel>(
  'exercise/summary/items',
)

export const exercisePrivateDataService = new Service<ExerciseModel>('exercise/private/items')

export function useStoreExercise(model: ExerciseModel): FetchDataAPI<unknown> {
  const callback = useCallback(() => exercisePrivateDataService.store(model), [model])
  return useFetchData<unknown>(callback, [model])
}

export function useLoadExercise(id: string): FetchDataAPI<ExerciseModel> {
  const callback = useCallback(() => exercisePrivateDataService.get(id), [id])
  return useFetchData<ExerciseModel>(callback, [id])
}

interface ListQueryParams {
  classifications: ExerciseModel['classifications']
}

export function useLoadExercisesSummary(
  params: ListQueryParams,
): FetchFirestoreListAPI<ExerciseSummaryModel> {
  const options: FetchFirestoreListOptions = useMemo(() => {
    const filter: GridFilterOptions = {
      where: [],
      orderBy: [
        ['classifications', 'asc'],
        ['published', 'desc'],
      ],
    }
    if (params.classifications) {
      filter.where?.push(['classifications', 'array-contains-any', params.classifications])
    }
    return {
      accumulate: true,
      pageSize: 10,
      filter,
    }
  }, [JSON.stringify(params)])
  return useFetchFirestoreList<ExerciseSummaryModel>('exercise/summary/items', options)
}

export async function storeExercise({ id, ...data }: ExerciseModel): Promise<ExerciseModel> {
  return cloudFnPost<ExerciseModel>(`/exercise/${id ?? ''}`, data, { withToken: true })
}

export function useExerciseModel(id?: string): LoadAndStoreModelAPI<ExerciseModel> {
  const load = useCallback((id) => exercisePrivateDataService.get(id), [])
  const store = useCallback<typeof storeExercise>(storeExercise, [])
  return useLoadAndStoreModel<ExerciseModel>(load, store, id, {
    title: '',
    lang: 'hu',
    description: '',
    created: new Date(),
    createdBy: '',
    updated: new Date(),
    updatedBy: '',
    classifications: [],
    difficulty: 0,
    state: ExerciseState.New,
    script: '',
    subTasks: [],
  })
}

export const changeState = (exerciseId: string, state: ExerciseState): Promise<void> =>
  cloudFnPost(`/exercise/${exerciseId}/state`, { state }, { withToken: true })

export const checkSubTask = (
  exerciseId: string,
  seed: number,
  subTask: number,
  answers: UCUserAnswer[],
): Promise<boolean> =>
  cloudFnPost(`/exercise/${exerciseId}/check`, { seed, subTask, answers }, { withToken: true })
