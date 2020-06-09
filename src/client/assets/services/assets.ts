import { useCallback } from 'react'
import { Service } from '../../generic/services'
import { useFetchData } from '../../generic/hooks'
import { AssetModel } from '../../../shared/assets/types'

export const assetsDataService = new Service<AssetModel>('assets')

export function useAssetsForItem(itemId: string) {
  const callback = useCallback(
    () => assetsDataService.getList({ where: [['itemId', '=', itemId]] }),
    [itemId]
  )
  return useFetchData<AssetModel>(callback, [itemId])
}
