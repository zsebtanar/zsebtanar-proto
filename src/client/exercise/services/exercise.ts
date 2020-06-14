import { useCallback } from 'react'
import { Service, cloudFnPost } from 'client/generic/services'
import { useFetchData } from 'client/generic/hooks'
import { ExerciseModel } from 'shared/exercise/types'
import { useLoadAndStoreModel } from '../../generic/hooks/loadAndStoreModel'

export const exerciseDataService = new Service<ExerciseModel>('exercise')

export function useStoreExercise(model: ExerciseModel) {
  const callback = useCallback(() => exerciseDataService.store(model), [model])
  return useFetchData<unknown>(callback, [model])
}

export function useLoadExercise(id: string) {
  const callback = useCallback(() => exerciseDataService.get(id), [id])
  return useFetchData<ExerciseModel>(callback, [id])
}

export function useLoadExercises() {
  const callback = useCallback(() => exerciseDataService.getList(), [])
  return useFetchData<ExerciseModel[]>(callback, [])
}

export async function storeExercise(data) {
  return cloudFnPost<ExerciseModel>(`/exercise/${data.id ?? ''}`, data, { withToken: true })
}

export function useExerciseModel(id?: string) {
  const load = useCallback(id => exerciseDataService.get(id), [])
  const store = useCallback<typeof storeExercise>(data => storeExercise(data), [])
  return useLoadAndStoreModel<ExerciseModel>(load, store, id)
}
