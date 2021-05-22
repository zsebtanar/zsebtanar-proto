import S from 'fluent-json-schema'

export const roleUpdateSchema = S.object()
  .prop('newRole', S.number().minimum(0).multipleOf(1))
  .required(['newRole'])
  .valueOf()

export const profileUpdateSchema = S.object()
  .prop('displayName', S.string().minLength(3).maxLength(64))
  .prop('photoURL', S.string().format(S.FORMATS.URL))
  .required(['displayName'])
  .valueOf()
