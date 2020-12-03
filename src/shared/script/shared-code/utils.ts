import { PLNumber, plNumber, PLVector, plVector } from 'pocket-lisp-stdlib'
import { RuntimeError } from 'pocket-lisp'

///

export const assert = (val: boolean, msg: string): boolean => {
  // TODO remove lang dependency
  if (val) throw new RuntimeError(msg)
  return true
}

export const assertType = (a: any, b: any): boolean =>
  assert(
    a.constructor !== b.constructor,
    `Type Error! Expected '${a.constructor && a.constructor.name}', but got '${
      b.constructor && b.constructor.name
    }'`,
  )

export const typeCheck = (type: any, value: any): boolean =>
  assert(
    type !== value.constructor,
    `Expected '${type.name}', but got '${value.constructor.name}'.`,
  )

export const assertInteger = (val: number) =>
  assert(!Number.isInteger(val), `Expected integer number', but got '${val}'.`)

export const assertIntegerRange = (min: number, max: number): void => {
  assertInteger(min)
  assertInteger(max)
  assert(max < min, `Invalid range (start > end)`)
}

export const plNumFn1 = (fn: (x: number) => number) => (x: PLNumber): PLNumber => {
  typeCheck(PLNumber, x)
  return plNumber(fn(x.value))
}

export const plNumFn2 = (fn: (x: number, y: number) => number) => (
  x: PLNumber,
  y: PLNumber,
): PLNumber => {
  typeCheck(PLNumber, x)
  typeCheck(PLNumber, y)
  return plNumber(fn(x.value, y.value))
}

export const plNumFn1Vec = (fn: (x: number) => Array<number>) => (
  x: PLNumber,
): PLVector<PLNumber> => {
  typeCheck(PLNumber, x)
  return plVector(...fn(x.value).map(plNumber))
}

export const plNumFn2Vec = (fn: (x: number, y: number) => Array<number>) => (
  x: PLNumber,
  y: PLNumber,
): PLVector<PLNumber> => {
  typeCheck(PLNumber, x)
  typeCheck(PLNumber, y)
  return plVector(...fn(x.value, y.value).map(plNumber))
}
