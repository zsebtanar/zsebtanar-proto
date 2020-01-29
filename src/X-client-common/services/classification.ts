import { pick, pipe, prop, sortBy, values } from 'ramda'
import { resolveSnapshot } from 'client/generic/services/firebase'
import { app } from 'client/generic/services/fireApp'

const DB = app.database()

const Classification = DB.ref('classifications')

export const GRADE = 'grade'
export const SUBJECT = 'subject'
export const TOPIC = 'topic'
export const TAGS = 'tags'

export function getClassification(group, uid) {
  return Classification.child(group.split('.').join('/'))
    .child(uid)
    .once('value')
    .then(s => s.val())
}

export function getAllClassification(): Promise<DB.Classifications> {
  return Classification.once('value').then(resolveSnapshot)
}

export function getAllClassificationByGroup(group) {
  return Classification.child(group.split('.').join('/'))
    .once('value')
    .then(pipe(resolveSnapshot, values, sortBy(prop('order'))))
}

export function updateClassification(group, uid, data) {
  return Classification.child(group.split('.').join('/'))
    .child(uid)
    .update({ ...pick(['name', 'role', 'active'], data) })
}

export function createClassification(group, data) {
  const path = group.split('.').join('/')
  const _key = Classification.child(path).push().key

  return Classification.child(path)
    .child(_key)
    .update({
      ...pick(['name', 'order'], data),
      _key: _key
    })
}
