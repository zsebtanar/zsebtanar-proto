import { cloudFnGet } from 'client/generic/services'

export const rePublishAllExercise = () =>
  cloudFnGet(`admin/re-publish-all-exercise`, {}, { withToken: true })
