import { useCallback } from 'react'
import { ClassificationModel } from '../../../shared/classification/type'
import { Service } from 'client/generic/services/fireStoreBase'
import { useFetchData, FetchDataAPI } from 'client/generic/hooks/fetchData'
import { cloudFnDelete, cloudFnPost } from '../../generic/services/firebase'

export const classificationService = new Service<ClassificationModel>('classification')

export function useLoadClassifications(): FetchDataAPI<ClassificationModel[]> {
  const callback = useCallback(() => classificationService.getList(), [])
  return useFetchData<ClassificationModel[]>(callback, [])
}

export function create(data: ClassificationModel): Promise<ClassificationModel> {
  return cloudFnPost(`/classification/`, data, { withToken: true })
}

export function update(data: ClassificationModel): Promise<ClassificationModel> {
  return cloudFnPost(`/classification/${data.id}`, data, { withToken: true })
}

export function remove(id: string): Promise<void> {
  return cloudFnDelete(`/classification/${id}`, {}, { withToken: true })
}
