import {
  suffixUtils,
  pitch,
  trailingZeros,
  dativus,
  convertSuffix,
  placeValue,
} from './suffixUtils'
import { pls, pln } from './utils'

describe('suffix utils', () => {
  test('trailingZeros', () => {
    expect(trailingZeros(0)).toEqual(0)
    expect(trailingZeros(1)).toEqual(0)
    expect(trailingZeros(-10)).toEqual(1)
    expect(trailingZeros(-123_000)).toEqual(3)
    expect(trailingZeros(12_000_000)).toEqual(6)
  })

  test('pitch', () => {
    expect(pitch(0)).toEqual('low')
    expect(pitch(-1)).toEqual('high')
    expect(pitch(2)).toEqual('high')
    expect(pitch(3)).toEqual('low')
    expect(pitch(4)).toEqual('high')
    expect(pitch(-5)).toEqual('high')
    expect(pitch(6)).toEqual('low')
    expect(pitch(7)).toEqual('high')
    expect(pitch(8)).toEqual('low')
    expect(pitch(9)).toEqual('high')
    expect(pitch(10)).toEqual('high')
    expect(pitch(20)).toEqual('low')
    expect(pitch(30)).toEqual('low')
    expect(pitch(40)).toEqual('high')
    expect(pitch(50)).toEqual('high')
    expect(pitch(60)).toEqual('low')
    expect(pitch(70)).toEqual('high')
    expect(pitch(80)).toEqual('low')
    expect(pitch(90)).toEqual('high')
    expect(pitch(100)).toEqual('low')
    expect(pitch(32_000)).toEqual('high')
    expect(pitch(2_000_000)).toEqual('low')
    expect(pitch(54_000_000_000)).toEqual('low')
  })

  test('dativus', () => {
    expect(dativus(-5)).toEqual('öt')
    expect(dativus(-1)).toEqual('et')
    expect(dativus(0)).toEqual('t')
    expect(dativus(1)).toEqual('et')
    expect(dativus(2)).toEqual('t')
    expect(dativus(3)).toEqual('at')
    expect(dativus(4)).toEqual('et')
    expect(dativus(5)).toEqual('öt')
    expect(dativus(6)).toEqual('ot')
    expect(dativus(7)).toEqual('et')
    expect(dativus(8)).toEqual('at')
    expect(dativus(9)).toEqual('et')
    expect(dativus(10)).toEqual('et')
    expect(dativus(15)).toEqual('öt')
    expect(dativus(20)).toEqual('at')
    expect(dativus(30)).toEqual('at')
    expect(dativus(40)).toEqual('et')
    expect(dativus(50)).toEqual('et')
    expect(dativus(60)).toEqual('at')
    expect(dativus(70)).toEqual('et')
    expect(dativus(80)).toEqual('at')
    expect(dativus(90)).toEqual('et')
    expect(dativus(100)).toEqual('at')
    expect(dativus(1000)).toEqual('et')
    expect(dativus(1234)).toEqual('et')
    expect(dativus(1_000_000_000)).toEqual('ot')
  })

  test('placeValue', () => {
    expect(placeValue(-5, 's')).toEqual('ös')
    expect(placeValue(0, 's')).toEqual('s')
    expect(placeValue(6, 's')).toEqual('os')
    expect(placeValue(7, 'ös')).toEqual('es')
    expect(placeValue(10, 'hoz')).toEqual('hez')
    expect(placeValue(78, 'esekhez')).toEqual('asokhoz')
    expect(placeValue(1000, 'asokat')).toEqual('eseket')
    expect(placeValue(2005, 'osnak')).toEqual('ösnek')
    expect(placeValue(2005, 'osnak')).toEqual('ösnek')
  })

  // test('convertSuffix', () => {
  //   const fn = convertSuffix
  //   expect(() => fn(0, 'ért')).toThrow('Invalid suffix: "ért"')
  //   expect(fn(0, 'as')).toEqual('s')
  //   expect(fn(1, 'as')).toEqual('es')
  //   expect(fn(2, 's')).toEqual('es')
  //   expect(fn(3, 'es')).toEqual('as')
  //   expect(fn(4, 's')).toEqual('es')
  //   expect(fn(5, 'as')).toEqual('ös')
  //   expect(fn(6, 'ös')).toEqual('os')
  //   expect(fn(7, 'ös')).toEqual('es')
  //   expect(fn(8, 'ös')).toEqual('as')
  //   expect(fn(9, 'as')).toEqual('es')
  //   expect(fn(10, 'os')).toEqual('es')
  // })

  test('suffix', () => {
    const fn = suffixUtils['suffix']
    expect(() => fn(pln(0), pls('út'))).toThrow('Invalid suffix: "út"')
    expect(() => fn(pln(0), pls('et '))).toThrow('Invalid suffix: "et "')
    expect(fn(pln(0), pls('öt'))).toEqual(pls('t'))
    expect(fn(pln(1), pls('t'))).toEqual(pls('et'))
    expect(fn(pln(-2), pls('et'))).toEqual(pls('t'))
    expect(fn(pln(5), pls('et'))).toEqual(pls('öt'))
    expect(fn(pln(-6), pls('öt'))).toEqual(pls('ot'))
  })
})
