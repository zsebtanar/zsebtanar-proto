import { Service } from 'client/generic/services'
import { useFetchData } from 'client/generic/hooks'
import { ExerciseModel } from '../../../shared/exercise/types'
import { useCallback } from 'react'

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
