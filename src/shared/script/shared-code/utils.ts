import { RuntimeError } from 'pocket-lisp'
import {
  PLNumber,
  plString,
  PLString,
  plNumber,
  plFractionNumber,
  plVector,
} from 'pocket-lisp-stdlib'

export const pls = plString
export const pln = plNumber
export const plf = plFractionNumber
export const plv = plVector

export const assert = (val: boolean, msg: string): boolean => {
  // TODO remove lang dependency
  if (val) throw new RuntimeError(msg)
  return true
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
export const assertType = (a: any, b: any): boolean =>
  assert(
    a.constructor !== b.constructor,
    `Type Error! Expected '${a.constructor && a.constructor.name}', but got '${
      b.constructor && b.constructor.name
    }'`,
  )

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
export const typeCheck = (type: any, value: any): boolean =>
  assert(
    type !== value.constructor,
    `Expected '${type.name}', but got '${value.constructor.name}'.`,
  )

export const assertInteger = (val: number): boolean =>
  assert(!Number.isInteger(val), `Expected integer number', but got '${val}'.`)

export const assertIntegerRange = (min: number, max: number): void => {
  assertInteger(min)
  assertInteger(max)
  assert(max < min, `Invalid range (start > end)`)
}

export const fnWrapperNumToStr = (fn: (x: number) => string) => (x: PLNumber): PLString => {
  typeCheck(PLNumber, x)
  return plString(fn(x.value))
}

export const fnWrapper2NumToNum = (fn: (x: number, y: number) => number) => (
  x: PLNumber,
  y: PLNumber,
): PLNumber => {
  typeCheck(PLNumber, x)
  typeCheck(PLNumber, y)
  return plNumber(fn(x.value, y.value))
}
