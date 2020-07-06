import { useCallback } from 'react'
import { ClassificationModel } from '../type'
import { Service } from 'client/generic/services/fireStoreBase'
import { useFetchData, FetchDataAPI } from 'client/generic/hooks/fetchData'

export const classificationService = new Service<ClassificationModel>('category', {
  excludeId: true,
})

export function useLoadClassifications(): FetchDataAPI<ClassificationModel> {
  const callback = useCallback(() => classificationService.get('classifications'), [])
  return useFetchData<ClassificationModel>(callback, [])
}
