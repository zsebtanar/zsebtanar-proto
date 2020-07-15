import React, { ReactNode, useReducer, Reducer, useMemo } from 'react'
import * as dp from 'dot-prop-immutable'
import { AssetGroup } from 'shared/assets/types'
import { fileToUrl, checkFileType, checkFileSize } from '../utils'
import { assetUpload } from '../services/firestorage'
import { assetsDataService } from '../services/assets'
import { useUser } from '../../user/providers/UserProvider'
import { firebase } from '../../generic/services/fireApp'

export enum UploadState {
  Pending,
  Uploading,
  Done,
}

interface Props {
  children: ReactNode
}

interface State {
  pendingAssets: PendingAsset[]
  uploadState: UploadState
  group: AssetGroup
  error?: Error
}

interface PendingAsset {
  file: File
  url: string
  error?: string
  progress: number
}

type Action =
  | { type: 'setHandler'; payload: { group: AssetGroup } }
  | { type: 'addFiles'; payload: PendingAsset[] }
  | { type: 'removeFile'; payload: File }
  | { type: 'startUpload' }
  | { type: 'uploadFinished' }
  | { type: 'fileUploadProgress'; payload: { index: number; progress: number } }
  | { type: 'fileUploaded'; payload: { index: number } }
  | { type: 'error'; payload: Error }
  | { type: 'reset' }

interface API {
  reset()
  selectGroup(group: AssetGroup): void
  unSelectGroup(): void
  addFiles(files: File[]): void
  removeFile(file: File): void
  uploadFiles()
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const ManageAssetContext = React.createContext<State>(undefined as any)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const ManageAssetDispatchContext = React.createContext<API>(undefined as any)

const initialState = {
  pendingAssets: [],
  group: AssetGroup.None,
  uploadState: UploadState.Pending,
}

export function AssetManagerProvider({ children }: Props): JSX.Element {
  const { user } = useUser()
  const [state, dispatch] = useReducer<Reducer<State, Action>>(assetReducer, initialState)
  const api: API = useMemo(
    () => ({
      reset() {
        dispatch({ type: 'reset' })
      },
      selectGroup(group: AssetGroup) {
        if (state.group !== AssetGroup.None) {
          throw new Error('You can not add more then 1 handler!')
        }
        dispatch({ type: 'setHandler', payload: { group } })
      },
      unSelectGroup() {
        dispatch({ type: 'setHandler', payload: { group: AssetGroup.None } })
      },
      async addFiles(files: File[]) {
        const filesWithUrl = await Promise.all(
          files.map(
            async (file): Promise<PendingAsset> => ({
              file,
              url: await fileToUrl(file),
              error: validateFile(file),
              progress: 0,
            }),
          ),
        )

        dispatch({ type: 'addFiles', payload: filesWithUrl })
      },
      removeFile(file: File) {
        dispatch({ type: 'removeFile', payload: file })
      },
      async uploadFiles() {
        if (state.group === AssetGroup.None) throw Error('You must select group first')
        if (!user?.uid) throw Error('Only singed in user can upload file')

        try {
          dispatch({ type: 'startUpload' })

          const group = state.group as AssetGroup
          const entries = Array.from(state.pendingAssets.entries())
          for (const [index, { file }] of entries) {
            const id = assetsDataService.createId()
            const uploadedFile = await assetUpload(
              id,
              group,
              file,
              ({ bytesTransferred, totalBytes }) =>
                dispatch({
                  type: 'fileUploadProgress',
                  payload: { index, progress: bytesTransferred / totalBytes },
                }),
            )
            await assetsDataService.update({
              id,
              group,
              created: firebase.firestore.FieldValue.serverTimestamp() as any,
              createdBy: user.uid,
              ...uploadedFile,
            })
            dispatch({ type: 'fileUploaded', payload: { index } })
          }
          dispatch({ type: 'uploadFinished' })
        } catch (error) {
          dispatch({ type: 'error', payload: error })
        }
      },
    }),
    [state],
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
    case 'reset':
      return { ...initialState }
    case 'startUpload':
      return { ...state, uploadState: UploadState.Uploading }
    case 'uploadFinished':
      return { ...state, pendingAssets: [], uploadState: UploadState.Done }
    case 'fileUploadProgress': {
      const { index, progress } = action.payload
      return dp.set(state, ['pendingAssets', index, 'progress'], progress)
    }
    case 'fileUploaded':
      return state
    case 'addFiles':
      return { ...state, pendingAssets: state.pendingAssets.concat(action.payload) }
    case 'removeFile':
      return {
        ...state,
        pendingAssets: state.pendingAssets.filter(({ file }) => file !== action.payload),
      }
    case 'setHandler':
      return { ...state, group: action.payload.group }
    case 'error':
      return { ...initialState, error: action.payload }
  }
  return state
}

export function useManageAssets(): State {
  const context = React.useContext(ManageAssetContext)
  if (context === undefined) {
    throw new Error('useManageAssets must be used within a ManageAssetContext')
  }
  return context
}

export function useManageAssetsDispatch(): API {
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
