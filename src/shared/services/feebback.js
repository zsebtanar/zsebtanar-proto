import { pick } from 'ramda'
import { resolveSnapshot } from '../util/firebase'

const DB = window.firebase.database()

const Feedback = DB.ref('feedback')

export function getAllFeedback () {
  return Feedback
    .once('value')
    .then(resolveSnapshot)
}

export function createFeedback (data) {
  const _key = Feedback.push().key
  return Feedback
    .child(_key)
    .update({
      ...pick(['type', 'email', 'description', 'site'], data),
      state: 'new',
      _key,
      _created: new Date()
    })
}
