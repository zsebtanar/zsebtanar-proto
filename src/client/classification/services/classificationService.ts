import { useCallback } from 'react'
import {
  ClassificationDetailsModel,
  ClassificationSummaryDoc,
} from '../../../shared/classification/type'
import { Service } from 'client/generic/services/fireStoreBase'
import { FetchDataAPI, useFetchData } from 'client/generic/hooks/fetchData'
import { cloudFnDelete, cloudFnPost } from '../../generic/services/firebase'

export const classificationService = new Service<ClassificationSummaryDoc>('classification', {
  excludeId: true,
})

// FIXME: remove hardcoded language code
export const classificationDetailsService = new Service<ClassificationDetailsModel>(
  'classification/hu/details',
)

export function useLoadClassifications(): FetchDataAPI<ClassificationSummaryDoc> {
  // FIXME: remove hardcoded language code
  const callback = useCallback(() => classificationService.get('hu'), [])
  return useFetchData<ClassificationSummaryDoc>(callback, [])
}
export function useLoadClassificationDetails(id: string): FetchDataAPI<ClassificationDetailsModel> {
  const callback = useCallback(() => classificationDetailsService.get(id), [id])
  return useFetchData<ClassificationDetailsModel>(callback, [])
}

export function create(data: ClassificationSummaryDoc): Promise<ClassificationSummaryDoc> {
  return cloudFnPost(`/classification/`, data, { withToken: true })
}

export function update(data: ClassificationSummaryDoc): Promise<ClassificationSummaryDoc> {
  return cloudFnPost(`/classification/${data.id}`, data, { withToken: true })
}

export function remove(id: string): Promise<void> {
  return cloudFnDelete(`/classification/${id}`, {}, { withToken: true })
}
