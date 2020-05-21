import { Service } from '../../generic/services'
import { ClassificationModel } from '../type'
import { useFetchData } from '../../generic/hooks'
import { useCallback } from 'react'

const classificationService = new Service<ClassificationModel>('category')

export function useLoadClassifications() {
  const callback = useCallback(() => classificationService.get('classifications'), [])
  return useFetchData<ClassificationModel>(callback, [])
}
