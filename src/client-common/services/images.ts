import { identity } from 'ramda'
import { app, firebase } from '../fireApp'
import 'firebase/storage'
import { resolveSnapshot } from 'client-common/util/firebase'

const storageRef = app.storage().ref()
const DB = app.database()
const Storage = DB.ref('storage')
const STATE_CHANGED = firebase.storage.TaskEvent.STATE_CHANGED

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
    .then((file: firebase.storage.UploadTaskSnapshot) =>
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
