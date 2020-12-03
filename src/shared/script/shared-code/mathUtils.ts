import { assertInteger, assertIntegerRange, plNumFn2Vec, plNumFn1Vec } from './utils'

export function divisors(num: number): Array<number> {
  //  Source: https://www.nayuki.io/page/calculate-divisors-javascript
  assertInteger(num)
  if (num < 1) {
    throw new Error('Number out of range (< 1)')
  } else if (num > 1000000) {
    throw new Error('Number too large')
  }
  const small: number[] = []
  const large: number[] = []
  const end = Math.floor(Math.sqrt(num))
  for (let i = 1; i <= end; i++) {
    if (num % i === 0) {
      small.push(i)
      if (i * i !== num)
        // Don't include a square root twice
        large.push(num / i)
    }
  }
  large.reverse()
  return small.concat(large)
}

export function range(start: number, end: number): Array<number> {
  assertIntegerRange(start, end)
  const length = end - start + 1 // include upper bound
  return Array.from({ length }, (_, i) => start + i)
}

export const mathUtils = {
  ['range']: plNumFn2Vec(range),
  ['divisors']: plNumFn1Vec(divisors),
}
