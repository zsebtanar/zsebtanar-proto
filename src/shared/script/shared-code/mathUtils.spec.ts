import { mathUtils } from './mathUtils'
import { plBool, plNumber, plString, plVector } from 'pocket-lisp-stdlib'

const pln = plNumber
const plv = plVector
const plb = plBool
const pls = plString

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
  })

  test('is-prime', () => {
    const fn = mathUtils['is-prime']
    expect(() => {
      fn(pln(0))
    }).toThrow('Number out of range (< 1)')
    expect(fn(pln(1))).toStrictEqual(plb(false))
    expect(fn(pln(2))).toStrictEqual(plb(true))
    expect(fn(pln(3))).toStrictEqual(plb(true))
    expect(fn(pln(4))).toStrictEqual(plb(false))
    expect(fn(pln(16))).toStrictEqual(plb(false))
    expect(fn(pln(19))).toStrictEqual(plb(true))
  })

  test('range', () => {
    const fn = mathUtils['range']
    expect(fn(pln(1), pln(2))).toStrictEqual(plv(pln(1), pln(2)))
    expect(() => {
      fn(pln(0), pln(-2))
    }).toThrow('Invalid range (start > end)')
  })

  test('num-to-roman', () => {
    const fn = mathUtils['num-to-roman']
    expect(() => {
      fn(pln(0))
    }).toThrow('Invalid range (< 1)')
    expect(() => {
      fn(pln(4000))
    }).toThrow('Invalid range (> 3999)')
    expect(fn(pln(1))).toStrictEqual(pls('I'))
    expect(fn(pln(199))).toStrictEqual(pls('CXCIX'))
    expect(fn(pln(2020))).toStrictEqual(pls('MMXX'))
    expect(fn(pln(3999))).toStrictEqual(pls('MMMCMXCIX'))
  })

  test('gcd', () => {
    const fn = mathUtils['gcd']
    expect(() => {
      fn(pln(0), pln(-2))
    }).toThrow('Invalid range (< 0)')
    expect(fn(pln(0), pln(0))).toStrictEqual(pln(0))
    expect(fn(pln(1), pln(1))).toStrictEqual(pln(1))
    expect(fn(pln(1), pln(2))).toStrictEqual(pln(1))
    expect(fn(pln(2), pln(5))).toStrictEqual(pln(1))
    expect(fn(pln(20), pln(50))).toStrictEqual(pln(10))
    expect(fn(pln(0), pln(100))).toStrictEqual(pln(100))
  })
})
