import {
  suffixUtils,
  pitch,
  trailingZeros,
  dativusSuffix,
  placeValueSuffix,
  convertSuffix,
  generalSuffix,
  suffixVowel,
} from './suffixUtils'
import { pls, pln } from './utils'

describe('suffix utils', () => {
  test('trailingZeros', () => {
    const fn = trailingZeros
    expect(fn(0)).toEqual(0)
    expect(fn(1)).toEqual(0)
    expect(fn(-10)).toEqual(1)
    expect(fn(-123_000)).toEqual(3)
    expect(fn(12_000_000)).toEqual(6)
  })

  test('pitch', () => {
    const fn = pitch
    expect(fn(0)).toEqual('low')
    expect(fn(-1)).toEqual('high')
    expect(fn(2)).toEqual('high')
    expect(fn(3)).toEqual('low')
    expect(fn(4)).toEqual('high')
    expect(fn(-5)).toEqual('high')
    expect(fn(6)).toEqual('low')
    expect(fn(7)).toEqual('high')
    expect(fn(8)).toEqual('low')
    expect(fn(9)).toEqual('high')
    expect(fn(10)).toEqual('high')
    expect(fn(20)).toEqual('low')
    expect(fn(30)).toEqual('low')
    expect(fn(40)).toEqual('high')
    expect(fn(50)).toEqual('high')
    expect(fn(60)).toEqual('low')
    expect(fn(70)).toEqual('high')
    expect(fn(80)).toEqual('low')
    expect(fn(90)).toEqual('high')
    expect(fn(100)).toEqual('low')
    expect(fn(32_000)).toEqual('high')
    expect(fn(2_000_000)).toEqual('low')
    expect(fn(54_000_000_000)).toEqual('low')
  })

  test('suffixVowel', () => {
    const fn = suffixVowel
    expect(() => fn(0, 'uoe')).toThrow('Invalid vowel type: "uoe"')
    expect(fn(0, 'ea')).toEqual('a')
    expect(fn(1, 'ae')).toEqual('e')
    expect(fn(0, 'öoe')).toEqual('o')
    expect(fn(1, 'öoe')).toEqual('e')
    expect(fn(5, 'öoe')).toEqual('ö')
    expect(fn(0, 'őó')).toEqual('ó')
    expect(fn(1, 'őó')).toEqual('ő')
  })

  test('dativusSuffix', () => {
    const fn = dativusSuffix
    expect(fn(-5)).toEqual('öt')
    expect(fn(-1)).toEqual('et')
    expect(fn(0)).toEqual('t')
    expect(fn(1)).toEqual('et')
    expect(fn(2)).toEqual('t')
    expect(fn(3)).toEqual('at')
    expect(fn(4)).toEqual('et')
    expect(fn(5)).toEqual('öt')
    expect(fn(6)).toEqual('ot')
    expect(fn(7)).toEqual('et')
    expect(fn(8)).toEqual('at')
    expect(fn(9)).toEqual('et')
    expect(fn(10)).toEqual('et')
    expect(fn(15)).toEqual('öt')
    expect(fn(20)).toEqual('at')
    expect(fn(30)).toEqual('at')
    expect(fn(40)).toEqual('et')
    expect(fn(50)).toEqual('et')
    expect(fn(60)).toEqual('at')
    expect(fn(70)).toEqual('et')
    expect(fn(80)).toEqual('at')
    expect(fn(90)).toEqual('et')
    expect(fn(100)).toEqual('at')
    expect(fn(1000)).toEqual('et')
    expect(fn(1234)).toEqual('et')
    expect(fn(45_000_000)).toEqual('t')
    expect(fn(3_000_000_000)).toEqual('ot')
  })

  test('placeValueSuffix', () => {
    const fn = placeValueSuffix
    expect(() => fn(0, 'ős')).toThrow('Invalid suffix: "ős"')
    expect(fn(-5, 's')).toEqual('ös')
    expect(fn(0, 's')).toEqual('s')
    expect(fn(1, 's')).toEqual('es')
    expect(fn(2, 's')).toEqual('es')
    expect(fn(3, 's')).toEqual('as')
    expect(fn(4, 's')).toEqual('es')
    expect(fn(5, 's')).toEqual('ös')
    expect(fn(6, 's')).toEqual('os')
    expect(fn(7, 'ös')).toEqual('es')
    expect(fn(8, 'ös')).toEqual('as')
    expect(fn(9, 'ös')).toEqual('es')
    expect(fn(10, 'ös')).toEqual('es')
    expect(fn(100, 'ös')).toEqual('as')
    expect(fn(1000, 'ös')).toEqual('es')
    expect(fn(10000, 'ös')).toEqual('es')
    expect(fn(100_000, 'ös')).toEqual('es')
    expect(fn(1000_000, 'ös')).toEqual('s')
    expect(fn(10_000_000, 'ös')).toEqual('s')
    expect(fn(100_000_000, 'ös')).toEqual('s')
    expect(fn(1_000_000_000, 'ös')).toEqual('os')
    expect(fn(1_000_000_000_000, 'ös')).toEqual('s')
    expect(fn(1_000_000_000_000_000, 'ös')).toEqual('os')
    expect(fn(0, 'esek')).toEqual('sok')
    expect(fn(1, 'sok')).toEqual('esek')
    expect(fn(3, 'sok')).toEqual('asok')
    expect(fn(5, 'sok')).toEqual('ösök')
    expect(fn(0, 'eseket')).toEqual('sokat')
    expect(fn(1, 'sokat')).toEqual('eseket')
    expect(fn(3, 'eseket')).toEqual('asokat')
    expect(fn(5, 'asokat')).toEqual('ösöket')
    expect(fn(0, 'eseknek')).toEqual('soknak')
    expect(fn(1, 'soknak')).toEqual('eseknek')
    expect(fn(3, 'eseknak')).toEqual('asoknak')
    expect(fn(5, 'asoknak')).toEqual('ösöknek')
    expect(fn(0, 'esekből')).toEqual('sokból')
    expect(fn(1, 'sokból')).toEqual('esekből')
    expect(fn(3, 'esekből')).toEqual('asokból')
    expect(fn(5, 'asokból')).toEqual('ösökből')
    expect(fn(0, 'eshez')).toEqual('shoz')
    expect(fn(1, 'shoz')).toEqual('eshez')
    expect(fn(3, 'eshez')).toEqual('ashoz')
    expect(fn(5, 'ashoz')).toEqual('öshöz')
  })

  test('generalSuffix', () => {
    const fn = generalSuffix
    expect(() => fn(0, 'ért')).toThrow('Invalid suffix: "ért"')
    expect(fn(0, 'ből')).toEqual('ból')
    expect(fn(1, 'ból')).toEqual('ből')
    expect(fn(0, 'nek')).toEqual('nak')
    expect(fn(1, 'nak')).toEqual('nek')
    expect(fn(0, 'höz')).toEqual('hoz')
    expect(fn(1, 'hoz')).toEqual('hez')
    expect(fn(5, 'hez')).toEqual('höz')
  })

  test('convertSuffix', () => {
    const fn = convertSuffix
    expect(() => fn(0, 'ért')).toThrow('Invalid suffix: "ért"')
    expect(fn(0, 'as')).toEqual('s')
    expect(fn(1, 'as')).toEqual('es')
    expect(fn(2, 's')).toEqual('es')
    expect(fn(3, 'es')).toEqual('as')
    expect(fn(4, 's')).toEqual('es')
    expect(fn(5, 'as')).toEqual('ös')
    expect(fn(6, 'ös')).toEqual('os')
    expect(fn(7, 'ös')).toEqual('es')
    expect(fn(8, 'ös')).toEqual('as')
    expect(fn(9, 'as')).toEqual('es')
    expect(fn(10, 'os')).toEqual('es')
  })

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
