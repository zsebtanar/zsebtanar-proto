import { RuntimeError } from 'pocket-lisp'
import { plFractionNumber, plNumber, plString, plVector } from 'pocket-lisp-stdlib'

export const pls = plString
export const pln = plNumber
export const plf = plFractionNumber
export const plv = plVector

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
