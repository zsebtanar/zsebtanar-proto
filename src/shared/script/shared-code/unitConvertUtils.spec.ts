import { unitConvertUtils } from './unitConvertUtils'
import { PLNumber, plNumber, plString } from 'pocket-lisp-stdlib'
import { floatEq } from '../../utils/math'

export function floatEqPL(a: PLNumber, b: PLNumber): boolean {
  return floatEq(a.value, b.value)
}

const pln = plNumber
const pls = plString

describe('convert utils', () => {
  test('convert-unit', () => {
    const fn = unitConvertUtils['convert-unit']
    expect(() => {
      fn(pln(1), pls('from'), pls('to'))
    }).toThrow('Invalid unit: "from"')
    expect(() => {
      fn(pln(1), pls('kg'), pls('s'))
    }).toThrow('Units "kg" and "s" don\\\'t match')
    expect(floatEqPL(fn(pln(10), pls('kg'), pls('g')), pln(10000))).toBe(true)
    expect(floatEqPL(fn(pln(2), pls('h'), pls('s')), pln(7200))).toBe(true)
    expect(floatEqPL(fn(pln(100), pls('g'), pls('t')), pln(0.0001))).toBe(true)
    expect(floatEqPL(fn(pln(360), pls('deg'), pls('rad')), pln(2 * Math.PI))).toBe(true)
    expect(floatEqPL(fn(pln(100), pls('mm^2'), pls('cm^2')), pln(1))).toBe(true)
    expect(floatEqPL(fn(pln(1000), pls('mm^3'), pls('cm^3')), pln(1))).toBe(true)
    expect(floatEqPL(fn(pln(100), pls('cl'), pls('dm^3')), pln(1))).toBe(true)
  })
})
