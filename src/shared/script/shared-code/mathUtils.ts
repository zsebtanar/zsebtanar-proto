import { PLNumber, plBool, PLBool, PLVector } from 'pocket-lisp-stdlib'
import { assertInteger, assertIntegerRange, plNumFn2Vec, plNumFn1Vec } from './utils'

export function inArray(list: PLVector<PLNumber>, n: PLNumber): PLBool {
  return list.contains(n)
}

// https://www.thepolyglotdeveloper.com/2015/04/determine-if-a-number-is-prime-using-javascript/
export function isPrime(n: PLNumber): PLBool {
  assertInteger(n.value)
  if (n.value < 1) {
    throw new Error('Number out of range (< 1)')
  }
  for (let i = 2; i < n.value; i++) {
    if (n.value % i === 0) {
      return plBool(false)
    }
  }
  return plBool(n.value > 1)
}

// https://www.nayuki.io/page/calculate-divisors-javascript
export function divisors(num: number): Array<number> {
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

// https://dev.to/ycmjason/how-to-create-range-in-javascript-539i
export function range(start: number, end: number): Array<number> {
  assertIntegerRange(start, end)
  const length = end - start + 1 // include upper bound
  return Array.from({ length }, (_, i) => start + i)
}

export const mathUtils = {
  ['range']: plNumFn2Vec(range),
  ['divisors']: plNumFn1Vec(divisors),
  ['is-prime']: isPrime,
  ['in']: inArray,
}
