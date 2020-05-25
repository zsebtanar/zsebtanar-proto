import { any, equals, identity, pipe, replace, toLower, values } from 'ramda'
import { UCSimpleText } from '../../../../../shared/exercise/types'

export function simpleTextCheck(
  control: UCSimpleText,
  solution: UCSimpleText['solution'],
  userInput: string
): boolean {
  const transform = pipe(
    input => input || '',
    control.props.caseSensitive ? identity : toLower,
    control.props.ignoreSpaces ? replace(/\s*/g, '') : identity
  )

  const normalizedInput = transform(userInput)
  const check = pipe(transform, equals(normalizedInput))
  const validate = pipe(values, any(check))

  return validate(solution)
}
