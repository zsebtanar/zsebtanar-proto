import { RuntimeError } from 'pocket-lisp'
import { PLNumber, plString, PLString } from 'pocket-lisp-stdlib'

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

export const assertInteger = (val: number): boolean =>
  assert(!Number.isInteger(val), `Expected integer number', but got '${val}'.`)

export const assertIntegerRange = (min: number, max: number): void => {
  assertInteger(min)
  assertInteger(max)
  assert(max < min, `Invalid range (start > end)`)
}

export const plFnNum2Str = (fn: (x: number) => string) => (x: PLNumber): PLString => {
  typeCheck(PLNumber, x)
  return plString(fn(x.value))
}
