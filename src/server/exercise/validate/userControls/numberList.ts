import { all, equals, identity, keys, pathOr, pipe, toPairs, values, zipWith } from 'ramda'

export function numberList(
  control: DB.UCNumberList,
  solution: DB.UCNumberListSolution,
  userInput: DB.UCNumberListSolution
): boolean {
  const acceptRandomOrder = pathOr(false, ['controlProps', 'acceptRandomOrder'], control)
  const solutions = pathOr({}, ['options'], solution)

  if (keys(solutions).length !== keys(userInput).length) return false

  if (acceptRandomOrder) {
    return all(
      identity as (any) => boolean,
      zipWith(equals, values(solutions).sort(), values(userInput).sort())
    )
  } else {
    return pipe(
      toPairs,
      all(([key, val]) => userInput[key] === val)
    )(solutions)
  }
}
