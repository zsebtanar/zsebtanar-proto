import { fireApp } from '../fireApp'
import { identity } from 'ramda'
import { resolveSnapshot } from 'client-common/util/firebase'
import { storage } from 'firebase'
import TaskEvent = storage.TaskEvent
import UploadTaskSnapshot = storage.UploadTaskSnapshot

const storageRef = fireApp.storage().ref()
const DB = fireApp.database()
const Storage = DB.ref('storage')

const STATE_CHANGED = TaskEvent.STATE_CHANGED

type UploadProgress = { bytesTransferred: number; totalBytes: number }

export function imageUpload(path, file, progressCb: (ss: UploadProgress) => void = identity) {
  const _key = Storage.push().key
  const fileName = file.name
  const uploadTask = storageRef.child(`storage/${path}/${_key}`).put(file, {})

  return new Promise((resolve, reject) =>
    uploadTask.on(
      STATE_CHANGED, // or 'state_changed'
      progressCb,
      reject,
      () => resolve(uploadTask.snapshot)
    )
  )
    .then((file: UploadTaskSnapshot) =>
      getFileUrl(file.metadata.fullPath).then(url => ({ file, url }))
    )
    .then(({ file, url }) => ({
      _key,
      name: fileName,
      fullPath: file.metadata.fullPath,
      url
    }))
}

export function getFiles(folder) {
  return (folder ? Storage.child(folder) : Storage).once('value').then(resolveSnapshot)
}

export function getFileUrl(filePath) {
  return storageRef.child(filePath).getDownloadURL()
}
