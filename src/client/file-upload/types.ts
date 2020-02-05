export type FileResource = RemoteFileResource | LocalFileResource

export interface RemoteFileResource {
  id: string
  url: string
  name: string
  type: string
}

export interface LocalFileResource extends RemoteFileResource {
  isNew: true
  file: File
}

export interface FileResourceUploadState {
  file: LocalFileResource
  progress: number
  error?: Error
}
