import 'firebase/storage'
import { app, firebase } from 'client/generic/services/fireApp'
import { identity } from 'client/generic/utils/fn'

///

type UTS = firebase.storage.UploadTaskSnapshot

interface UploadProgress {
  bytesTransferred: number
  totalBytes: number
}

export interface UploadedFile {
  mimeType: string
  fileName: string
  fullPath: string
  url: string
}

///

const storageRef = app.storage().ref()

const STATE_CHANGED = firebase.storage.TaskEvent.STATE_CHANGED

///

export async function assetUpload(
  id: string,
  path: string,
  file: File,
  progressCb: (up: UploadProgress) => void = identity,
): Promise<UploadedFile> {
  const snapshot = await createUploadTask(file, id, path, progressCb)

  const url = await getFileUrl(snapshot.metadata.fullPath)

  return {
    fileName: file.name,
    mimeType: file.type,
    fullPath: snapshot.metadata.fullPath,
    url,
  }
}

export function getFileUrl(filePath: string): Promise<string> {
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
      () => resolve(uploadTask.snapshot),
    ),
  )
}
