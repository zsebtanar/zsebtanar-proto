import { mathUtils } from './mathUtils'
import { plBool, plNumber, plVector } from 'pocket-lisp-stdlib'

const pln = plNumber
const plv = plVector
const plb = plBool

describe('math utils', () => {
  test('divisors', () => {
    const fn = mathUtils['divisors']
    expect(() => {
      fn(pln(0))
    }).toThrow('Number out of range (< 1)')
    expect(() => {
      fn(pln(1000001))
    }).toThrow('Number too large')
    expect(fn(pln(1))).toStrictEqual(plv(pln(1)))
    expect(fn(pln(2))).toStrictEqual(plv(pln(1), pln(2)))
    expect(fn(pln(4))).toStrictEqual(plv(pln(1), pln(2), pln(4)))
    expect(fn(pln(6))).toStrictEqual(plv(pln(1), pln(2), pln(3), pln(6)))
    expect(fn(pln(12))).toStrictEqual(plv(pln(1), pln(2), pln(3), pln(4), pln(6), pln(12)))
  }),
  test('in', () => {
    const fn = mathUtils['in']
    expect(fn(plv(pln(1), pln(2)), pln(1))).toBe(plb(true))
    expect(fn(plv(pln(1), pln(2)), pln(3))).toBe(plb(false))
  }),
  test('is-prime', () => {
    const fn = mathUtils['is-prime']
    expect(() => {
      fn(pln(0))
    }).toThrow('Number out of range (< 1)')
    expect(fn(pln(1))).toBe(plb(false))
    expect(fn(pln(2))).toBe(plb(true))
    expect(fn(pln(3))).toBe(plb(true))
    expect(fn(pln(4))).toBe(plb(false))
    expect(fn(pln(16))).toBe(plb(false))
    expect(fn(pln(19))).toBe(plb(true))
  }),
    test('range', () => {
      const fn = mathUtils['range']
      expect(fn(pln(1), pln(2))).toStrictEqual(plv(pln(1), pln(2)))
      expect(() => {
        fn(pln(0), pln(-2))
      }).toThrow('Invalid range (start > end)')
    })
})
