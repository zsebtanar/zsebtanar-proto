import { path, pipe, sortBy, toPairs } from 'ramda'

module.exports.pairsInOrder = pipe(toPairs, sortBy(path([1, 'order'])))
