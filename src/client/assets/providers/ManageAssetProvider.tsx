import React, { ReactNode } from 'react'
import { AssetModel, AssetMap } from '../../../shared/assets/types'
import { UseModelProps } from '../../generic/hooks/model'

interface Props extends UseModelProps<AssetMap> {
  children: ReactNode
}

interface PendingAsset {
  file: File
  url: string
}

interface API {
  assetList: AssetModel[]
  pendingAssets: PendingAsset[]
  addFiles(files: File[]): void
  uploadFiles()
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const ManageAssetContext = React.createContext<API>({} as any)

export function AssetManagerProvider({ children, onChange, name }: Props) {
  const api: API = {
    assetList: [],
    pendingAssets: [],
    addFiles(files: File[]): void {
      return undefined
    },
    uploadFiles() {
      return undefined
    }
  }

  return <ManageAssetContext.Provider value={api}>{children}</ManageAssetContext.Provider>
}

export function useManageAssets() {
  const context = React.useContext(ManageAssetContext)
  if (context === undefined) {
    throw new Error('useManageAssets must be used within a ManageAssetContext')
  }
  return context
}
