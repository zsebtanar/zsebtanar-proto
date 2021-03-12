import { langUtils } from './langUtils'
import { pls, pln, plf } from './utils'

describe('lang utils', () => {
  test('abbreviate', () => {
    const fn = langUtils['abbreviate']
    expect(fn(pls('NONE'), pls('valami'))).toEqual(pls('valami'))
    expect(fn(pls('HU'), pls('missing'))).toEqual(pls('missing'))
    expect(fn(pls('HU'), pls('centiliter'))).toEqual(pls('cl'))
    expect(fn(pls('HU'), pls('kilogram'))).toEqual(pls('kg'))
    expect(fn(pls('HU'), pls('másodperc'))).toEqual(pls('mp'))
    expect(fn(pls('HU'), pls('óra'))).toEqual(pls('ó'))
  })

  test('translate', () => {
    const fn = langUtils['translate']
    expect(fn(pls('NONE'), pls('valami'))).toEqual(pls('valami'))
    expect(fn(pls('HU'), pls('missing'))).toEqual(pls('missing'))
    expect(fn(pls('HU'), pls('óra'))).toEqual(pls('h'))
    expect(fn(pls('HU'), pls('másodperc'))).toEqual(pls('s'))
    expect(fn(pls('HU'), pls('hüvelyk'))).toEqual(pls('in'))
  })

  test('article', () => {
    const fn = langUtils['article']
    expect(fn(pln(-5))).toEqual(pls('a'))
    expect(fn(pln(0))).toEqual(pls('a'))
    expect(fn(pln(1))).toEqual(pls('az'))
    expect(fn(pln(2))).toEqual(pls('a'))
    expect(fn(pln(3))).toEqual(pls('a'))
    expect(fn(pln(4))).toEqual(pls('a'))
    expect(fn(pln(5))).toEqual(pls('az'))
    expect(fn(pln(6))).toEqual(pls('a'))
    expect(fn(pln(7))).toEqual(pls('a'))
    expect(fn(pln(8))).toEqual(pls('a'))
    expect(fn(pln(9))).toEqual(pls('a'))
    expect(fn(pln(10))).toEqual(pls('a'))
  })

  test('num-to-text', () => {
    const fn = langUtils['num-to-text']
    /* integers */
    expect(fn(pln(0))).toEqual(pls('nulla'))
    expect(fn(pln(2))).toEqual(pls('kettő'))
    expect(fn(pln(-5))).toEqual(pls('mínusz öt'))
    expect(fn(pln(123))).toEqual(pls('százhuszonhárom'))
    expect(fn(pln(201))).toEqual(pls('kétszázegy'))
    expect(fn(pln(1023))).toEqual(pls('ezerhuszonhárom'))
    expect(fn(pln(2001))).toEqual(pls('kétezer-egy'))
    expect(fn(pln(200001))).toEqual(pls('kétszázezer-egy'))
    expect(fn(pln(102_789))).toEqual(pls('százkétezer-hétszáznyolcvankilenc'))
    expect(fn(pln(402_789))).toEqual(pls('négyszázkétezer-hétszáznyolcvankilenc'))
    expect(fn(pln(1_402_789))).toEqual(pls('egymillió-négyszázkétezer-hétszáznyolcvankilenc'))
    expect(fn(pln(111_402_789))).toEqual(
      pls('száztizenegymillió-négyszázkétezer-hétszáznyolcvankilenc'),
    )
    expect(fn(pln(1_500_402_789))).toEqual(
      pls('egymilliárd-ötszázmillió-négyszázkétezer-hétszáznyolcvankilenc'),
    )
    expect(fn(pln(98_000_000_001))).toEqual(pls('kilencvennyolcmilliárd-egy'))
    expect(fn(pln(234_001_000_000))).toEqual(pls('kétszázharmincnégymilliárd-egymillió'))
    /* fractions */
    expect(fn(plf(1, 2))).toEqual(pls('egy ketted'))
    expect(fn(plf(-3, 7))).toEqual(pls('mínusz három heted'))
    /* simplification expected */
    expect(fn(plf(0, 10))).toEqual(pls('nulla egyed'))
    expect(fn(plf(-2, 4))).toEqual(pls('mínusz egy ketted'))
    /* negative sign attached to numerator */
    expect(fn(plf(1, -5))).toEqual(pls('mínusz egy ötöd'))
  })
})
