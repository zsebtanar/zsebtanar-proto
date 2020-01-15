export function pickBy<T, K extends keyof T, R>(fn: (value: T[K], key: K) => boolean, obj: T): R {
  return Object.keys(obj).reduce((acc, key) => {
    const val = obj[key]
    if (fn(val, key as K)) {
      acc[key] = val
    }
    return acc
  }, {}) as R
}
