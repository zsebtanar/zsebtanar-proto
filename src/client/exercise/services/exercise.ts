import { useCallback, useMemo } from 'react'
import { ExerciseModel, ExerciseState } from 'shared/exercise/types'
import { useLoadAndStoreModel, LoadAndStoreModelAPI } from '../../generic/hooks/loadAndStoreModel'
import { Service } from 'client/generic/services/fireStoreBase'
import { useFetchData, FetchDataAPI } from 'client/generic/hooks/fetchData'
import { cloudFnPost } from 'client/generic/services/firebase'
import {
  useFetchFirestoreList,
  FetchFirestoreListOptions,
  FetchFirestoreListAPI,
} from '../../generic/hooks/fetchFirestoreList'

export const exerciseDataService = new Service<ExerciseModel>('exercise')

export function useStoreExercise(model: ExerciseModel): FetchDataAPI<unknown> {
  const callback = useCallback(() => exerciseDataService.store(model), [model])
  return useFetchData<unknown>(callback, [model])
}

export function useLoadExercise(id: string): FetchDataAPI<ExerciseModel> {
  const callback = useCallback(() => exerciseDataService.get(id), [id])
  return useFetchData<ExerciseModel>(callback, [id])
}

interface ListQueryParams {
  classifications: ExerciseModel['classifications']
}

export function useLoadExercises(params: ListQueryParams): FetchFirestoreListAPI<ExerciseModel> {
  const options: FetchFirestoreListOptions = useMemo(() => {
    const filter: GridFilterOptions = { where: [] }
    if (params.classifications) {
      filter.where?.push(['classifications', 'array-contains-any', params.classifications])
    }
    return {
      accumulate: true,
      pageSize: 25,
      filter,
    }
  }, [JSON.stringify(params)])
  return useFetchFirestoreList<ExerciseModel>('exercise', options)
}

export async function storeExercise({ id, ...data }: ExerciseModel): Promise<ExerciseModel> {
  return cloudFnPost<ExerciseModel>(`/exercise/${id ?? ''}`, data, { withToken: true })
}

export function useExerciseModel(id?: string): LoadAndStoreModelAPI<ExerciseModel> {
  const load = useCallback((id) => exerciseDataService.get(id), [])
  const store = useCallback<typeof storeExercise>(storeExercise, [])
  return useLoadAndStoreModel<ExerciseModel>(load, store, id, {
    title: '',
    description: '',
    classifications: [],
    difficulty: 0,
    state: ExerciseState.Draft,
    script: '',
    subTasks: [],
  })
}
