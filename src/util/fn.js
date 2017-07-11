import {pipe, sortBy, toPairs, path} from 'ramda'

export const pairsInOrder = pipe(toPairs, sortBy(path([1, 'order'])))