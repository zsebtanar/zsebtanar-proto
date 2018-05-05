import { all, equals, identity, pipe, pathOr, toPairs, zipWith, values, keys } from 'ramda'

export function numberList(control, solution, userInput) {
  const acceptRandomOrder = pathOr(false, ['controlProps', 'acceptRandomOrder'], control)
  const solutions = pathOr({}, ['options'], solution)

  if (keys(solutions).length !== keys(userInput).length) return false

  if (acceptRandomOrder) {
    return all(identity, zipWith(equals, values(solutions).sort(), values(userInput).sort()))
  } else {
    return pipe(toPairs, all(([key, val]) => userInput[key] === val))(solutions)
  }
}
