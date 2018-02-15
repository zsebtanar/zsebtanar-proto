import { curry, path, pipe, sortBy, toPairs } from 'ramda'

module.exports.pairsInOrder = pipe(toPairs, sortBy(path([1, 'order'])))

module.exports.reduceP = curry(function reducePF(fn, init, arr) {
  return arr.reduce(
    (promise, value) => promise.then(acc => Promise.resolve(fn(acc, value))),
    Promise.resolve(init)
  )
})
