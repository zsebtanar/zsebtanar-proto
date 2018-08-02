import { any, equals, identity, pipe, replace, toLower, values } from 'ramda'

export function simpleTextCheck(
  control: DB.UCSimpleText,
  solution: DB.UCSimpleTextSolution,
  userInput: DB.UCSimpleTextSolution
): boolean {
  const transform = pipe(
    input => input || '',
    solution.caseSensitive ? identity : toLower,
    solution.ignoreSpaces ? replace(/\s*/g, '') : identity
  )

  const normalizedInput = transform(userInput)
  const check = pipe(
    transform,
    equals(normalizedInput)
  )
  const validate = pipe(
    values,
    any(check)
  )

  return validate(solution.options)
}
