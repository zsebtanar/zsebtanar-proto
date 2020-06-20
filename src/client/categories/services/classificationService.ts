import { Service } from '../../generic/services'
import { ClassificationModel } from '../type'
import { useFetchData } from '../../generic/hooks'
import { useCallback } from 'react'

export const classificationService = new Service<ClassificationModel>('category', {
  excludeId: true
})

export function useLoadClassifications() {
  const callback = useCallback(() => classificationService.get('classifications'), [])
  return useFetchData<ClassificationModel>(callback, [])
}
