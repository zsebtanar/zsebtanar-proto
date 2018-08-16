import { fireApp } from '../fireApp'
import { resolveSnapshot } from '../util/firebase'
import { cloudFnPost } from '../util/firebase'

const DB = fireApp.database()
const Feedback = DB.ref('feedback')

export function getAllFeedback() {
  return Feedback.once('value').then(resolveSnapshot)
}

export const createFeedback = (data) =>
  cloudFnPost('feedback', data)
