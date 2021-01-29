import { useCallback } from 'react'
import { AssetModel, AssetGroup } from 'shared/assets/types'
import { Service } from '../../generic/services/fireStoreBase'
import { useFetchData } from '../../generic/hooks/fetchData'

export const assetsDataService = new Service<AssetModel>('assets')

export function useGetAssetByGroup(group: AssetGroup | undefined) {
  const callback = useCallback(
    () => assetsDataService.getList(group ? { where: [['group', '==', group]] } : undefined),
    [group],
  )
  return useFetchData<AssetModel[]>(callback, [group])
}
