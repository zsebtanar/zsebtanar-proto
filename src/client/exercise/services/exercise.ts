import { useCallback } from 'react'
import { ExerciseModel, ExerciseState } from 'shared/exercise/types'
import { useLoadAndStoreModel, LoadAndStoreModelAPI } from '../../generic/hooks/loadAndStoreModel'
import { Service } from 'client/generic/services/fireStoreBase'
import { useFetchData, FetchDataAPI } from 'client/generic/hooks/fetchData'
import { cloudFnPost } from 'client/generic/services/firebase'

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

export function useLoadExercises(params: ListQueryParams): FetchDataAPI<ExerciseModel[]> {
  const options: GridFilterOptions = { where: [] }
  if (params.classifications) {
    options?.where?.push(['classifications', 'array-contains-any', params.classifications])
  }
  const callback = useCallback(() => exerciseDataService.getList(options), [])
  return useFetchData<ExerciseModel[]>(callback, [])
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
