import React, { ReactNode, useReducer, Reducer, useMemo } from 'react'
import * as dp from 'dot-prop-immutable'
import { AssetModel, AssetMap, AssetGroup } from 'shared/assets/types'
import { UseModelProps } from '../../generic/hooks/model'
import { fileToUrl, checkFileType, checkFileSize } from '../utils'

interface Props {
  children: ReactNode
}

interface Handler {
  group: string
  model: UseModelProps<AssetMap>
}

interface State {
  pendingAssets: PendingAsset[]
  uploadInProgress: boolean
  handler?: Handler
}

type Action =
  | { type: 'setHandler'; payload?: Handler }
  | { type: 'addFiles'; payload: PendingAsset[] }
  | { type: 'removeFile'; payload: File }

interface PendingAsset {
  file: File
  url: string
  error: string | undefined
}

interface API {
  addHandler(group: AssetGroup, bind: UseModelProps<AssetMap>): void
  removeHandler(): void
  selectAsset(asset: AssetModel): void
  addFiles(files: File[]): void
  removeFile(file: File): void
  uploadFiles()
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const ManageAssetContext = React.createContext<State>(undefined as any)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const ManageAssetDispatchContext = React.createContext<API>(undefined as any)

export function AssetManagerProvider({ children }: Props) {
  const [state, dispatch] = useReducer<Reducer<State, Action>>(assetReducer, {
    pendingAssets: [],
    uploadInProgress: false
  })
  const api: API = useMemo(
    () => ({
      addHandler(group: AssetGroup, model: UseModelProps<AssetMap>) {
        if (state.handler) {
          throw new Error('You can not add more then 1 handler!')
        }
        dispatch({ type: 'setHandler', payload: { group, model } })
      },
      removeHandler() {
        dispatch({ type: 'setHandler', payload: undefined })
      },
      selectAsset({ id, url }: AssetModel) {
        if (!state.handler) {
          throw new Error('You must add handler first')
        }
        if (id) {
          const { value, name, onChange } = state.handler.model
          onChange({ name, value: dp.set(value, id, { url }) })
        }
      },
      async addFiles(files: File[]) {
        const filesWithUrl = await Promise.all(
          files.map(async file => ({
            file,
            url: await fileToUrl(file),
            error: validateFile(file)
          }))
        )

        dispatch({ type: 'addFiles', payload: filesWithUrl })
      },
      removeFile(file: File) {
        dispatch({ type: 'removeFile', payload: file })
      },
      uploadFiles() {
        return undefined
      }
    }),
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
  switch (action.type) {
    case 'addFiles':
      return dp.set(state, 'pendingAssets', state.pendingAssets.concat(action.payload))
    case 'removeFile':
      return dp.set(
        state,
        'pendingAssets',
        state.pendingAssets.filter(({ file }) => file !== action.payload)
      )
    case 'setHandler':
      return dp.set(state, 'handler', action.payload)
  }
  return state
}

export function useManageAssets() {
  const context = React.useContext(ManageAssetContext)
  if (context === undefined) {
    throw new Error('useManageAssets must be used within a ManageAssetContext')
  }
  return context
}

export function useManageAssetsDispatch() {
  const context = React.useContext(ManageAssetDispatchContext)
  if (context === undefined) {
    throw new Error('useManageAssetsDispatch must be used within a ManageAssetDispatchContext')
  }
  return context
}

function validateFile(file: File): string | undefined {
  if (!checkFileType(file)) return `Csak png, jpeg, webp vagy gif fájl tölthető fel.`
  if (!checkFileSize(file)) return `A fájl méret túl nagy`
}
