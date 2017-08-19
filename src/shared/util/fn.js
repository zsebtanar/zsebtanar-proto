import { curry, path, pipe, sortBy, toPairs } from 'ramda'

export const pairsInOrder = pipe(toPairs, sortBy(path([1, 'order'])))

export const assert = curry((predicate, message, value) => {
  if (predicate(value)) {
    return value
  } else {
    throw new Error(message)
  }
})
