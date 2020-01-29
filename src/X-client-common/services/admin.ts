import { cloudFnGet } from 'client-common/util/firebase'

export const rePublishAllExercise = () =>
  cloudFnGet(`admin/re-publish-all-exercise`, {}, { withToken: true })
