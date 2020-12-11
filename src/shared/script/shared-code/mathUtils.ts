import { PLNumber, plBool, PLBool, plNumber, PLVector, plVector } from 'pocket-lisp-stdlib'
import { assertInteger, assertIntegerRange } from './utils'

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
export function divisors(num: PLNumber): PLVector<PLNumber> {
  const n = num.value
  assertInteger(n)
  if (n < 1) {
    throw new Error('Number out of range (< 1)')
  } else if (n > 1000000) {
    throw new Error('Number too large')
  }
  const small: number[] = []
  const large: number[] = []
  const end = Math.floor(Math.sqrt(n))
  for (let i = 1; i <= end; i++) {
    if (n % i === 0) {
      small.push(i)
      if (i * i !== n)
        // Don't include a square root twice
        large.push(n / i)
    }
  }
  large.reverse()
  const divisors = small.concat(large)
  return plVector(...divisors.map(plNumber))
}

// https://dev.to/ycmjason/how-to-create-range-in-javascript-539i
export function range(start: PLNumber, end: PLNumber): PLVector<PLNumber> {
  assertIntegerRange(start.value, end.value)
  const length = end.value - start.value + 1 // include upper bound
  const rng = Array.from({ length }, (_, i) => start.value + i)
  return plVector(...rng.map(plNumber))
}

export const mathUtils = {
  range,
  divisors,
  ['is-prime']: isPrime,
}
