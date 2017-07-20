import { pick, pipe, values } from 'ramda'
import { resolveSnapshot } from '../../util/firebase'

const DB = window.firebase.database()

const Classification = DB.ref('classifications')

export const GRADE = 'grade'
export const SUBJECT = 'subject'
export const TOPIC = 'topic'
export const TAGS = 'tags'

export function getClassification (group, uid) {
  return Classification
    .child(group)
    .child(uid)
    .once('value')
    .then(s => s.val())
}

export function getAllClassification () {
  return Classification
    .once('value')
    .then(resolveSnapshot)
}

export function getAllClassificationByGroup (group) {
  return Classification
    .child(group)
    .once('value')
    .then(pipe(resolveSnapshot, values))
}

export function updateClassification (group, uid, data) {
  return Classification
    .child(group)
    .child(uid)
    .update({...pick(['name', 'role', 'active'], data)})
}

export function createClassification (group, data) {
  const _key = Classification
    .child(group)
    .push()
    .key

  return Classification
    .child(group)
    .child(_key)
    .update({
      ...pick(['name'], data),
      _key: _key,
    })
}
