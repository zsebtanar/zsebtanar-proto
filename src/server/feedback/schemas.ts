import S from 'fluent-json-schema'

export const RECAPTCHA_RESPONSE_PARAM = 'g-recaptcha-response'

export const CreateFeedbackSchema = S.object()
  .prop('email', S.string().format(S.FORMATS.EMAIL))
  .prop('type', S.enum(['error', 'note']))
  .prop('site', S.string().maxLength(32))
  .prop('pathname', S.string().maxLength(128))
  .prop('description', S.string().maxLength(1024))
  .prop(RECAPTCHA_RESPONSE_PARAM, S.string())
  .required(['email', 'type', 'site', 'pathname', 'description', RECAPTCHA_RESPONSE_PARAM])
  .valueOf()
