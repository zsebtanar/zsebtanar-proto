import React, { ReactNode } from 'react'
import { AssetMap } from 'shared/assets/types'

interface Props {
  attachments: AssetMap
  children: ReactNode
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const AssetContext = React.createContext<AssetMap>({} as any)

export function AssetProvider({ children, attachments }: Props) {
  return <AssetContext.Provider value={attachments ?? {}}>{children}</AssetContext.Provider>
}

export function useAsset() {
  const context = React.useContext(AssetContext)
  if (context === undefined) {
    throw new Error('useAsset must be used within a AssetContext')
  }
  return context
}
