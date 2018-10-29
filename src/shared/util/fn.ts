import {
  addIndex,
  assocPath,
  curry,
  flip,
  fromPairs,
  map,
  path,
  pickBy,
  pipe,
  sortBy,
  toPairs,
  merge,
  propEq,
  not,
  isNil
} from 'ramda'

export const indexedMap = addIndex(map)

export const pairsInOrder = pipe(
  toPairs,
  sortBy(path([1, 'order']))
)

export const pairsInNameOrder = pipe(
  toPairs,
  sortBy(path([1, 'name']))
)

export const listToOrderedObject = pipe(
  indexedMap(flip(assocPath([1, 'order']))),
  fromPairs
)

// tslint:disable-next-line:no-console
export const log = (...args) => console.log(...args) || args[0]

export const assert = curry((predicate, message, value) => {
  if (predicate(value)) {
    return value
  } else {
    throw new Error(message)
  }
})

export const assertP = curry((predicate, message, value) => {
  if (predicate(value)) {
    return Promise.resolve(value)
  } else {
    return Promise.reject(message)
  }
})

export function shuffle(ary) {
  const array = [...ary]
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const temp = array[i]
    array[i] = array[j]
    array[j] = temp
  }
  return array
}

const isNotMetaKey = (_, key) => key.charAt(0) !== '_'

export function excludeMetaKeys(obj) {
  return pickBy(isNotMetaKey, obj)
}

const littleACode = 'a'.charCodeAt(0)
export function abcIndex(idx) {
  return String.fromCharCode(littleACode + idx)
}

export const reduceP = curry(function reducePF(fn, init, arr) {
  return arr.reduce(
    (promise, value) => promise.then(acc => Promise.resolve(fn(acc, value))),
    Promise.resolve(init)
  )
})

export const fMerge = flip(merge)

export const idNotEq = curry(
  pipe(
    propEq('id'),
    not
  )
)

export const isNotNil: (any) => boolean = pipe(isNil, not)