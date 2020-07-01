export const noop = () => undefined

export const log = (...args) => {
  console.log(...args)
  return args[0]
}

export const clamp = (min: number, max: number, value: number) => {
  return Math.max(min, Math.min(max, value))
}

const littleACode = 'a'.charCodeAt(0)
export function toAbcIndex(idx) {
  return String.fromCharCode(littleACode + clamp(0, 25, idx))
}

export const range = (from: number, to: number, step = 1): number[] => {
  if (from > to) return []

  const res = [from]
  for (let i = from + step; i < to; i += step) {
    res.push(i)
  }
  return res
}

export const sortByProp = prop => (A, B) => {
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
