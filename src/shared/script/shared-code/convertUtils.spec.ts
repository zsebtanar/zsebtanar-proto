import { convertUtils } from './convertUtils'
import { plNumber, plString } from 'pocket-lisp-stdlib'

const pln = plNumber
const pls = plString

describe('convert utils', () => {
  test('convert', () => {
    const fn = convertUtils['convert']
    expect(() => {
      fn(pln(1), pls('from'), pls('to'))
    }).toThrow('Invalid unit: "from"')
    expect(() => {
      fn(pln(1), pls('kg'), pls('s'))
    }).toThrow('Units "kg" and "s" don\\\'t match')
    expect(fn(pln(10), pls('kg'), pls('g'))).toEqual(pln(10000))
    expect(fn(pln(2), pls('h'), pls('s'))).toEqual(pln(7200))
    expect(fn(pln(100), pls('g'), pls('t'))).toEqual(pln(0.0001))
    expect(fn(pln(360), pls('deg'), pls('rad'))).toEqual(pln(2 * Math.PI))
    expect(fn(pln(100), pls('mm^2'), pls('cm^2'))).toEqual(pln(1))
    expect(fn(pln(1000), pls('mm^3'), pls('cm^3'))).toEqual(pln(1))
    expect(fn(pln(100), pls('cl'), pls('dm^3'))).toEqual(pln(1))
  })
})
