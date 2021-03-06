export const noop = (): void => undefined

export const log = (...args: unknown[]): unknown => {
  if (__DEV__) {
    if (args[0] instanceof Error) {
      console.error(...args)
    } else {
      console.log(...args)
    }
    return args[0]
  }
}

export const clamp = (min: number, max: number, value: number): number => {
  return Math.max(min, Math.min(max, value))
}

const littleACode = 'a'.charCodeAt(0)
export function toAbcIndex(idx: number): string {
  return String.fromCharCode(littleACode + clamp(0, 25, idx))
}

export const range = (from: number, to: number, step = 1): number[] => {
  if (from >= to) return []

  const res = [from]
  for (let i = from + step; i < to; i += step) {
    res.push(i)
  }
  return res
}

export const sortByProp = (prop: string) => (
  A: Record<string, any>,
  B: Record<string, any>,
): number => {
  const a = A?.[prop]
  const b = B?.[prop]
  return a < b ? -1 : a > b ? 1 : 0
}

const hasOwnProp = Object.prototype.hasOwnProperty
export const omit = <T, K extends string>(obj: T, props: readonly K[]): Omit<T, K> => {
  const result = {} as Record<string, unknown>
  for (const key in obj) {
    if (hasOwnProp.call(obj, key) && !props.includes(key as any)) {
      result[key] = obj[key]
    }
  }
  return result as Omit<T, K>
}

export const list2map = <T>(prop: string, list: T[]): Record<string, T> => {
  return list.reduce((acc, item) => {
    if (item[prop]) {
      acc[item[prop]] = item
    }
    return acc
  }, {})
}

export const map2list = <T>(object: Record<string, T>, keyName = 'key') => {
  return Object.keys(object).reduce((list, key) => {
    list.push({ [keyName]: key, ...object[key] })
    return list
  }, [] as any)
}

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
export function convertPLHashMapToObject<T extends Record<string, unknown>>(
  hashmaps: Map<string, unknown>,
): T {
  return Object.fromEntries(hashmaps) as T
}

export function convertObjectToArray<T = unknown>(obj: Record<number, T>): T[] {
  return Object.entries(obj ?? {}).reduce((a, [idx, val]) => {
    a[idx] = val
    return a
  }, [])
}

export function filledArray<T>(length: number, data: T): T[] {
  return Array(length).fill(data)
}
