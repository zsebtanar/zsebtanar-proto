import { cloudFnGet } from '../../generic/services/firebase'

export const rePublishAllExercise = () =>
  cloudFnGet(`admin/re-publish-all-exercise`, {}, { withToken: true })
