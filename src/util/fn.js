import { path, pipe, sortBy, toPairs } from 'ramda'

export const pairsInOrder = pipe(toPairs, sortBy(path([1, 'order'])))
