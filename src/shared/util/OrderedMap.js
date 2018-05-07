import { assocPath, curry, dissoc, flip, fromPairs, path, pipe, sortBy, toPairs } from 'ramda'
import { indexedMap } from './fn'

const setOrder = flip(assocPath([1, 'order']))
const sortByOrder = sortBy(path([1, 'order']))

export const removeFromObjById = curry((key, obj) =>
  pipe(dissoc(key), toPairs, sortByOrder, indexedMap(setOrder), fromPairs)(obj)
)

export const orderedListFromObj = pipe(toPairs, sortByOrder)
