import React, { ReactNode, Reducer, useReducer } from 'react'
import {
  FileResource,
  FileResourceUploadState,
  LocalFileResource,
  RemoteFileResource
} from 'client/file-upload/types'

interface Props {
  children: ReactNode
}

interface State {
  files: RemoteFileResource[]
  filesError?: Error
  pendingFiles: LocalFileResource[]
  upload: FileResourceUploadState[]
}

interface FileResourceContextAPI {
  getAllFiles(): Promise<FileResource[]>
}

type Action =
  | { type: 'AddFile'; payload: LocalFileResource }
  | { type: 'FileListLoadSuccess'; payload: FileResource[] }
  | { type: 'FileListLoadFail'; payload: Error }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const FileResourceContext = React.createContext<State>({} as any)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const FileResourceDispatchContext = React.createContext<FileResourceContextAPI>({} as any)

const defaultState: State = {
  files: [],
  pendingFiles: [],
  upload: []
}

function resourceReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'AddFile':
      return { ...state, pendingFiles: [...state.pendingFiles, action.payload] }
    case 'FileListLoadSuccess':
      return { ...state, files: action.payload, filesError: undefined }
    case 'FileListLoadFail':
      return { ...state, files: [], filesError: action.payload }
  }
}

export function FileResourceProvider({ children }: Props) {
  const [state, dispatch] = useReducer<Reducer<State, Action>>(resourceReducer, defaultState)

  const api: FileResourceContextAPI = {
    getAllFiles: () => {
      // FIXME: missing file load
      dispatch({ type: 'FileListLoadSuccess', payload: [] })
      return Promise.resolve([])
    }
  }

  return (
    <FileResourceContext.Provider value={state}>
      <FileResourceDispatchContext.Provider value={api}>
        {children}
      </FileResourceDispatchContext.Provider>
    </FileResourceContext.Provider>
  )
}

export function useFileResource() {
  const context = React.useContext(FileResourceContext)
  if (context === undefined) {
    throw new Error('useFileResource must be used within a FileResourceContext')
  }
  return context
}

export function useFileResourceDispatch() {
  const context = React.useContext(FileResourceDispatchContext)
  if (context === undefined) {
    throw new Error('useFileResourceDispatch must be used within a FileResourceDispatchContext')
  }
  return context
}
