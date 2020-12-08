import { convertUtils } from './convertUtils'
import { plNumber, plString } from 'pocket-lisp-stdlib'

const pln = plNumber
const pls = plString

describe('convert utils', () => {
  test('convert', () => {
    const fn = convertUtils['convert']
    expect(() => {
      fn(pls('from'), pls('to'))
    }).toThrow('Invalid unit: "from"')
    expect(() => {
      fn(pls('kg'), pls('s'))
    }).toThrow('Units "kg" and "s" don\\\'t match')
    expect(fn(pls('kg'), pls('g'))).toEqual(pln(1000))
    expect(fn(pls('h'), pls('s'))).toEqual(pln(3600))
    expect(fn(pls('g'), pls('t'))).toEqual(pln(0.000001))
    expect(fn(pls('deg'), pls('rad'))).toEqual(pln((2 * Math.PI) / 360))
  })
})
