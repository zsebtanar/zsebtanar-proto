import { useCallback } from 'react'
import { ClassificationModel } from '../../../shared/categories/type'
import { Service } from 'client/generic/services/fireStoreBase'
import { useFetchData, FetchDataAPI } from 'client/generic/hooks/fetchData'

export const classificationService = new Service<ClassificationModel>('classification')

export function useLoadClassifications(): FetchDataAPI<ClassificationModel[]> {
  const callback = useCallback(() => classificationService.getList(), [])
  return useFetchData<ClassificationModel[]>(callback, [])
}
