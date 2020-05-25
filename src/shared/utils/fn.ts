export const log = (...args) => {
  console.log(...args)
  return args[0]
}

const littleACode = 'a'.charCodeAt(0)
export function toAbcIndex(idx) {
  return String.fromCharCode(littleACode + idx)
}

export const range = (from: number, to: number, step = 1): number[] => {
  if (from < to) return []

  const res = [from]
  for (let i = from; i < to; i += step) {
    res.push((i += step))
  }
  return res
}

export const sortByProp = prop => (A, B) => {
  const a = A?.[prop]
  const b = B?.[prop]
  return a < b ? -1 : a > b ? 1 : 0
}

export const omit = <T, K extends string>(obj: T, props: readonly K[]): Omit<T, K> => {
  const result = {} as Record<string, unknown>
  const hasOwnProp = Object.prototype.hasOwnProperty
  for (const key in obj) {
    if (hasOwnProp.call(obj, key) && !props.includes(key as any)) {
      result[key] = obj[key]
    }
  }
  return result as Omit<T, K>
}
