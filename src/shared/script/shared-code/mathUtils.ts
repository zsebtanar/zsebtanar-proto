import { PLNumber, plBool, PLBool, plNumber, PLVector, plVector } from 'pocket-lisp-stdlib'
import { assertInteger, assertIntegerRange, plFnNum2Str, plFnNumNum2Num } from './utils'

// https://www.nayuki.io/page/calculate-divisors-javascript
export function divisors(num: PLNumber): PLVector<PLNumber> {
  const n = num.toJS()
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
  return plVector(...divisors.map((n) => plNumber(n)))
}

// https://www.thepolyglotdeveloper.com/2015/04/determine-if-a-number-is-prime-using-javascript/
export function isPrime(num: PLNumber): PLBool {
  const n = num.toJS()
  assertInteger(n)
  if (n < 1) {
    throw new Error('Number out of range (< 1)')
  }
  for (let i = 2; i < n; i++) {
    if (n % i === 0) {
      return plBool(false)
    }
  }
  return plBool(n > 1)
}

// https://stackoverflow.com/questions/9083037/convert-a-number-into-a-roman-numeral-in-javascript#32851198
const numToRoman = (num: number): string => {
  if (num < 1) {
    throw new Error('Invalid range (< 1)')
  } else if (num > 3999) {
    throw new Error('Invalid range (> 3999)')
  }
  const map = {
    M: 1000,
    CM: 900,
    D: 500,
    CD: 400,
    C: 100,
    XC: 90,
    L: 50,
    XL: 40,
    X: 10,
    IX: 9,
    V: 5,
    IV: 4,
    I: 1,
  }
  for (const key in map) {
    if (num >= map[key]) {
      return key + (num === map[key] ? '' : numToRoman(num - map[key]))
    }
  }
  return ''
}

// https://dev.to/ycmjason/how-to-create-range-in-javascript-539i
export function range(start: PLNumber, end: PLNumber): PLVector<PLNumber> {
  assertIntegerRange(start.toJS(), end.toJS())
  const length = end.intValue - start.intValue + 1 // include upper bound
  const rng = Array.from({ length }, (_, i) => plNumber(start.intValue + i))
  return plVector(...rng)
}

// Euclid's algorithm
export const gcd = (a: number, b: number): number => {
  if (a < 0 || b < 0) {
    throw new Error('Invalid range (< 0)')
  }
  return a === b || !a ? b : !b ? a : gcd(b, a % b)
}

export const mathUtils = {
  divisors,
  ['is-prime']: isPrime,
  ['num-to-roman']: plFnNum2Str(numToRoman),
  gcd: plFnNumNum2Num(gcd),
  range,
}
