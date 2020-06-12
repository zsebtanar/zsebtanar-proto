import { useCallback } from 'react'
import { Service } from '../../generic/services'
import { useFetchData } from '../../generic/hooks'
import { AssetModel } from '../../../shared/assets/types'

export const assetsDataService = new Service<AssetModel>('assets')

export function useGetAssetByGroup(group: string | undefined) {
  const callback = useCallback(
    () => assetsDataService.getList({ where: [['group', '==', group]] }),
    [group]
  )
  return useFetchData<AssetModel[]>(callback, [group])
}
