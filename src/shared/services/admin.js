import { cloudFnGet } from 'shared/util/firebase'

export const rePublishAllExercise = () =>
  cloudFnGet(`admin/re-publish-all-exercise`, {}, { withToken: true })
