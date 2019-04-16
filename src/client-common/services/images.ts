import { identity } from 'ramda'
import { app, firebase } from '../fireApp'
import 'firebase/storage'
import { resolveSnapshot } from 'client-common/util/firebase'

///

type UTS = firebase.storage.UploadTaskSnapshot

interface UploadProgress {
  bytesTransferred: number
  totalBytes: number
}

export interface UploadedFile {
  _key: string
  name: string
  type: string
  fullPath: string
  url: string
}

///

const storageRef = app.storage().ref()
const DB = app.database()
const Storage = DB.ref('storage')

const STATE_CHANGED = firebase.storage.TaskEvent.STATE_CHANGED

///

export async function imageUpload(
  path: string,
  file: File,
  progressCb: (up: UploadProgress) => void = identity
): Promise<UploadedFile> {
  const _key = Storage.push().key
  const snapshot = await createUploadTask(file, _key, path, progressCb)
  const url = await getFileUrl(snapshot.metadata.fullPath)

  return {
    _key,
    name: file.name,
    type: file.type,
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
  // @ts-ignore
  return new Promise((resolve, reject) =>
    uploadTask.on(
      STATE_CHANGED, // or 'state_changed'
      progressCb,
      reject,
      () => resolve(uploadTask.snapshot)
    )
  )
}
