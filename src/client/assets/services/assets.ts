import { useCallback } from 'react'
import { Service } from '../../generic/services'
import { useFetchData } from '../../generic/hooks'
import { AssetModel, AssetGroup } from '../../../shared/assets/types'

export const assetsDataService = new Service<AssetModel>('assets')

export function useGetAssetByGroup(group: AssetGroup | undefined) {
  const callback = useCallback(
    () => assetsDataService.getList(group ? { where: [['group', '==', group]] } : undefined),
    [group]
  )
  return useFetchData<AssetModel[]>(callback, [group])
}
