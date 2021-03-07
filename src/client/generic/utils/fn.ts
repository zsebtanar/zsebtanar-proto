import { PLString, PLVector, PLHashMap } from 'pocket-lisp-stdlib'

/**
 * Accept any value and return with the same value
 *
 * @param val
 */
export function identity<T>(val: T): T {
  return val
}

/**
 * Pick key/values from a source object by a function
 *
 * @param fn  Prediction function which get the object value and key as parameters and return with
 *            true if the keys is needed in the new object otherwise false
 * @param obj source object
 */
export function pickBy<T, K extends keyof T, R>(fn: (value: T[K], key: K) => boolean, obj: T): R {
  return Object.keys(obj).reduce((acc, key) => {
    const val = obj[key]
    if (fn(val, key as K)) {
      acc[key] = val
    }
    return acc
  }, {}) as R
}

/**
 * Generate a UID
 */
export function uid(): string {
  return (Date.now() + Math.floor(Math.random() * 0x1000000)).toString(16).substr(1)
}

export function numberSortAsc(a: number, b: number): number {
  return a - b
}

/**
 * Parse vector of PLHashmaps and convert into JS object
 */
export function convertPLHashMap(hashmaps: PLVector<PLHashMap<PLString>>): unknown {
  const jsObj = hashmaps.toJS() as Map<string, string>[]
  return jsObj.map((x) => Object.fromEntries(x))
}
