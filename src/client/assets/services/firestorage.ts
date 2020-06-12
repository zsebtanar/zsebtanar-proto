import 'firebase/storage'
import { resolveSnapshot, app, firebase } from 'client/generic/services'
import { identity } from '../../generic/utils'

///

type UTS = firebase.storage.UploadTaskSnapshot

interface UploadProgress {
  bytesTransferred: number
  totalBytes: number
}

export interface UploadedFile {
  id: string
  mimeType: string
  fileName: string
  fullPath: string
  url: string
}

///

const storageRef = app.storage().ref()
const DB = app.database()
const Storage = DB.ref('storage')

const STATE_CHANGED = firebase.storage.TaskEvent.STATE_CHANGED

///

export async function assetUpload(
  path: string,
  file: File,
  progressCb: (up: UploadProgress) => void = identity
): Promise<UploadedFile> {
  const id = Storage.push().key
  const snapshot = await createUploadTask(file, id, path, progressCb)
  const url = await getFileUrl(snapshot.metadata.fullPath)

  if (!id) {
    throw Error('Invalid storage key')
  }

  return {
    id,
    fileName: file.name,
    mimeType: file.type,
    fullPath: snapshot.metadata.fullPath,
    url
  }
}

export function getFiles(folder) {
  return (folder ? Storage.child(folder) : Storage).once('value').then(resolveSnapshot)
}

export function getFileUrl(filePath) {
  return storageRef.child(filePath).getDownloadURL()
}

///

async function createUploadTask(file, key, path, progressCb): Promise<UTS> {
  const uploadTask = storageRef.child(`storage/${path}/${key}`).put(file, {})

  return new Promise((resolve, reject) =>
    uploadTask.on(
      STATE_CHANGED, // or 'state_changed'
      progressCb,
      reject,
      () => resolve(uploadTask.snapshot)
    )
  )
}
