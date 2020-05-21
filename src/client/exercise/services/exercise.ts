import { Service } from 'client/generic/services'
import { useFetchData } from 'client/generic/hooks'
import { ExerciseModel } from '../type'

export const exerciseData = new Service<ExerciseModel>('exercise')

export function useStoreWikiPage(model: ExerciseModel) {
  return useFetchData<unknown>(() => exerciseData.store(model), [model])
}

export function useLoadWikiPage(pageId: string) {
  return useFetchData<ExerciseModel>(() => exerciseData.get(pageId), [pageId])
}

export function useLoadWikiPages() {
  return useFetchData<ExerciseModel[]>(() => exerciseData.getList(), [])
}
