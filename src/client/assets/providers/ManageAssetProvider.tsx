import React, { ReactNode, useReducer, Reducer, useMemo } from 'react'
import { AssetModel, AssetMap, AssetGroup } from 'shared/assets/types'
import { UseModelProps } from '../../generic/hooks/model'

interface Props {
  children: ReactNode
}

interface State {
  assetList: AssetModel[]
  pendingAssets: PendingAsset[]
}

type Action = { type: '' }

interface PendingAsset {
  file: File
  url: string
}

interface API {
  open(group: AssetGroup, bind: UseModelProps<AssetMap>): void
  close(): void
  addFiles(files: File[]): void
  uploadFiles()
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const ManageAssetContext = React.createContext<State>(undefined as any)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const ManageAssetDispatchContext = React.createContext<API>(undefined as any)

export function AssetManagerProvider({ children }: Props) {
  const [state, dispatch] = useReducer<Reducer<State, Action>>(assetReducer, {
    assetList: [],
    pendingAssets: []
  })
  const api: API = useMemo(
    {
      addFiles(files: File[]): void {
        return undefined
      },
      uploadFiles() {
        return undefined
      }
    },
    [state]
  )

  return (
    <ManageAssetContext.Provider value={state}>
      <ManageAssetDispatchContext.Provider value={api}>
        {children}
      </ManageAssetDispatchContext.Provider>
    </ManageAssetContext.Provider>
  )
}

function assetReducer(state: State, action: Action): State {
  return state
}

export function useManageAssets() {
  const context = React.useContext(ManageAssetContext)
  if (context === undefined) {
    throw new Error('useManageAssets must be used within a ManageAssetContext')
  }
  return context
}
