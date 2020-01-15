import { all, equals, identity, keys, pathOr, pipe, toPairs, values, zipWith } from 'ramda'

export function numberList(
  control: DB.UCNumberList,
  solution: DB.UCNumberListSolution,
  userInput: DB.UCNumberListInput
): boolean {
  const acceptRandomOrder = pathOr(false, ['controlProps', 'acceptRandomOrder'], control)
  const solutions = pathOr({}, ['options'], solution)

  if (keys(solutions).length !== keys(userInput).length) return false

  if (acceptRandomOrder) {
    return all(
      identity as (any) => boolean,
      zipWith(
        equals,
        values(solutions)
          .sort()
          .map(parseFloat),
        values(userInput)
          .sort()
          .map(parseFloat)
      )
    )
  } else {
    return pipe(
      toPairs,
      all(([key, val]) => parseFloat(userInput[key]) === parseFloat(val))
    )(solutions)
  }
}
