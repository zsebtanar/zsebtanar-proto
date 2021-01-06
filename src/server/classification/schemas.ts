import S from 'fluent-json-schema'

export const classificationSchema = S.object()
  .prop('newRole', S.number().minimum(0).multipleOf(1))
  .required(['newRole'])
  .valueOf()
