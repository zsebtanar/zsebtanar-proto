import {
  suffixUtils,
  getLastDigit,
  getLastNonZeroDigit,
  isNumberGroupEven,
  pitch,
  trailingZeros,
  dativSuffix,
  placeValueSuffix,
  convertSuffix,
  withSuffix,
  multSuffix,
  generalSuffix,
  suffixVowel,
  fractionSuffix,
  correctNumSuffix,
} from './suffixUtils'
import { pls, pln, plf } from './utils'

describe('suffix utils', () => {
  test('getLastDigit', () => {
    const fn = getLastDigit
    expect(fn(0)).toEqual(0)
    expect(fn(1)).toEqual(1)
    expect(fn(-13)).toEqual(3)
    expect(fn(-123_132)).toEqual(2)
    expect(fn(12_000_008)).toEqual(8)
  })

  test('getLastNonZeroDigit', () => {
    const fn = getLastNonZeroDigit
    expect(fn(0)).toEqual(0)
    expect(fn(1)).toEqual(1)
    expect(fn(-130)).toEqual(3)
    expect(fn(-123_132_000)).toEqual(2)
    expect(fn(12_800_000)).toEqual(8)
  })

  test('trailingZeros', () => {
    const fn = trailingZeros
    expect(fn(0)).toEqual(0)
    expect(fn(1)).toEqual(0)
    expect(fn(-10)).toEqual(1)
    expect(fn(-123_000)).toEqual(3)
    expect(fn(12_000_000)).toEqual(6)
  })

  test('isNumberGroupEven', () => {
    const fn = isNumberGroupEven
    expect(fn(1)).toEqual(true)
    expect(fn(10)).toEqual(true)
    expect(fn(100)).toEqual(true)
    expect(fn(1000)).toEqual(false)
    expect(fn(10_000)).toEqual(false)
    expect(fn(100_000)).toEqual(false)
    expect(fn(1_000_000)).toEqual(true)
    expect(fn(10_000_000)).toEqual(true)
    expect(fn(100_000_000)).toEqual(true)
    expect(fn(1_000_000_000)).toEqual(false)
    expect(fn(10_000_000_000)).toEqual(false)
    expect(fn(100_000_000_000)).toEqual(false)
    expect(fn(1_000_000_000_000)).toEqual(true)
    expect(fn(1_000_000_000_000_000)).toEqual(false)
    expect(fn(1_000_000_000_000_000_000)).toEqual(true)
    expect(fn(1_000_000_000_000_000_000_000)).toEqual(false)
  })

  test('pitch', () => {
    const fn = pitch
    expect(fn(0)).toEqual('low')
    expect(fn(-1)).toEqual('high')
    expect(fn(2)).toEqual('high')
    expect(fn(-3)).toEqual('low')
    expect(fn(4)).toEqual('high')
    expect(fn(-5)).toEqual('high')
    expect(fn(6)).toEqual('low')
    expect(fn(7)).toEqual('high')
    expect(fn(8)).toEqual('low')
    expect(fn(-9)).toEqual('high')
    expect(fn(10)).toEqual('high')
    expect(fn(20)).toEqual('low')
    expect(fn(30)).toEqual('low')
    expect(fn(-40)).toEqual('high')
    expect(fn(50)).toEqual('high')
    expect(fn(60)).toEqual('low')
    expect(fn(-70)).toEqual('high')
    expect(fn(80)).toEqual('low')
    expect(fn(-90)).toEqual('high')
    expect(fn(100)).toEqual('low')
    expect(fn(32_000)).toEqual('high')
    expect(fn(-2_000_000)).toEqual('low')
    expect(fn(-54_000_000_000)).toEqual('low')
  })

  test('suffixVowel', () => {
    const fn = suffixVowel
    expect(() => fn(0, 'uoe')).toThrow('Invalid vowel type: "uoe"')
    expect(fn(0, 'ea')).toEqual('a')
    expect(fn(1, 'ae')).toEqual('e')
    expect(fn(0, 'éá')).toEqual('á')
    expect(fn(1, 'áé')).toEqual('é')
    expect(fn(-0, 'öoe')).toEqual('o')
    expect(fn(-1, 'öoe')).toEqual('e')
    expect(fn(5, 'öoe')).toEqual('ö')
    expect(fn(0, 'őó')).toEqual('ó')
    expect(fn(-1, 'őó')).toEqual('ő')
  })

  test('dativSuffix', () => {
    const fn = dativSuffix
    expect(fn(-5)).toEqual('öt')
    expect(fn(-1)).toEqual('et')
    expect(fn(0)).toEqual('t')
    expect(fn(1)).toEqual('et')
    expect(fn(2)).toEqual('t')
    expect(fn(3)).toEqual('at')
    expect(fn(-4)).toEqual('et')
    expect(fn(5)).toEqual('öt')
    expect(fn(6)).toEqual('ot')
    expect(fn(-7)).toEqual('et')
    expect(fn(8)).toEqual('at')
    expect(fn(9)).toEqual('et')
    expect(fn(10)).toEqual('et')
    expect(fn(-15)).toEqual('öt')
    expect(fn(20)).toEqual('at')
    expect(fn(30)).toEqual('at')
    expect(fn(40)).toEqual('et')
    expect(fn(-50)).toEqual('et')
    expect(fn(60)).toEqual('at')
    expect(fn(70)).toEqual('et')
    expect(fn(80)).toEqual('at')
    expect(fn(-90)).toEqual('et')
    expect(fn(100)).toEqual('at')
    expect(fn(1000)).toEqual('et')
    expect(fn(1234)).toEqual('et')
    expect(fn(-45_000_000)).toEqual('t')
    expect(fn(3_000_000_000)).toEqual('ot')
  })

  test('placeValueSuffix', () => {
    const fn = placeValueSuffix
    expect(() => fn(0, 'ős')).toThrow('Invalid suffix: "ős"')
    expect(fn(-5, 's')).toEqual('ös')
    expect(fn(0, 's')).toEqual('s')
    expect(fn(-1, 's')).toEqual('es')
    expect(fn(2, 's')).toEqual('es')
    expect(fn(3, 's')).toEqual('as')
    expect(fn(-4, 's')).toEqual('es')
    expect(fn(5, 's')).toEqual('ös')
    expect(fn(6, 's')).toEqual('os')
    expect(fn(-7, 'ös')).toEqual('es')
    expect(fn(8, 'ös')).toEqual('as')
    expect(fn(9, 'ös')).toEqual('es')
    expect(fn(-10, 'ös')).toEqual('es')
    expect(fn(100, 'ös')).toEqual('as')
    expect(fn(1000, 'ös')).toEqual('es')
    expect(fn(10000, 'ös')).toEqual('es')
    expect(fn(-100_000, 'ös')).toEqual('es')
    expect(fn(1000_000, 'ös')).toEqual('s')
    expect(fn(10_000_000, 'ös')).toEqual('s')
    expect(fn(-100_000_000, 'ös')).toEqual('s')
    expect(fn(1_000_000_000, 'ös')).toEqual('os')
    expect(fn(-1_000_000_000_000, 'ös')).toEqual('s')
    expect(fn(1_000_000_000_000_000, 'ös')).toEqual('os')
    expect(fn(-0, 'esek')).toEqual('sok')
    expect(fn(1, 'sok')).toEqual('esek')
    expect(fn(3, 'sok')).toEqual('asok')
    expect(fn(-5, 'sok')).toEqual('ösök')
    expect(fn(0, 'eseket')).toEqual('sokat')
    expect(fn(-1, 'sokat')).toEqual('eseket')
    expect(fn(3, 'eseket')).toEqual('asokat')
    expect(fn(-5, 'asokat')).toEqual('ösöket')
    expect(fn(0, 'esekkel')).toEqual('sokkal')
    expect(fn(-1, 'sokkal')).toEqual('esekkel')
    expect(fn(3, 'esekkel')).toEqual('asokkal')
    expect(fn(5, 'asokkal')).toEqual('ösökkel')
    expect(fn(-0, 'eseknek')).toEqual('soknak')
    expect(fn(1, 'soknak')).toEqual('eseknek')
    expect(fn(-3, 'eseknak')).toEqual('asoknak')
    expect(fn(5, 'asoknak')).toEqual('ösöknek')
    expect(fn(0, 'esekből')).toEqual('sokból')
    expect(fn(-1, 'sokból')).toEqual('esekből')
    expect(fn(3, 'esekből')).toEqual('asokból')
    expect(fn(5, 'asokból')).toEqual('ösökből')
    expect(fn(-0, 'eshez')).toEqual('shoz')
    expect(fn(1, 'shoz')).toEqual('eshez')
    expect(fn(2, 'shoz')).toEqual('eshez')
    expect(fn(-3, 'eshez')).toEqual('ashoz')
    expect(fn(5, 'ashoz')).toEqual('öshöz')
  })

  test('withSuffix', () => {
    const fn = withSuffix
    expect(fn(0)).toEqual('val')
    expect(fn(-1)).toEqual('gyel')
    expect(fn(-2)).toEqual('vel')
    expect(fn(3)).toEqual('mal')
    expect(fn(-4)).toEqual('gyel')
    expect(fn(-5)).toEqual('tel')
    expect(fn(6)).toEqual('tal')
    expect(fn(-7)).toEqual('tel')
    expect(fn(8)).toEqual('cal')
    expect(fn(-9)).toEqual('cel')
    expect(fn(-10)).toEqual('zel')
    expect(fn(20)).toEqual('szal')
    expect(fn(-30)).toEqual('cal')
    expect(fn(-40)).toEqual('nel')
    expect(fn(50)).toEqual('nel')
    expect(fn(-60)).toEqual('nal')
    expect(fn(-70)).toEqual('nel')
    expect(fn(80)).toEqual('nal')
    expect(fn(-90)).toEqual('nel')
    expect(fn(100)).toEqual('zal')
    expect(fn(1000)).toEqual('rel')
    expect(fn(10_000)).toEqual('rel')
    expect(fn(100_000)).toEqual('rel')
    expect(fn(1_000_000)).toEqual('val')
    expect(fn(1_000_000_000)).toEqual('dal')
    expect(fn(1_000_000_000_000)).toEqual('val')
    expect(fn(1_000_000_000_000_000)).toEqual('dal')
  })

  test('multSuffix', () => {
    const fn = multSuffix
    expect(fn(0, 'unknown')).toEqual('unknown')
    expect(fn(0, 'ször')).toEqual('szor')
    expect(fn(1, 'szor')).toEqual('szer')
    expect(fn(-2, 'szor')).toEqual('szer')
    expect(fn(5, 'szer')).toEqual('ször')
    expect(fn(20, 'szer')).toEqual('szor')
    expect(fn(0, 'szörös')).toEqual('szoros')
    expect(fn(1, 'szoros')).toEqual('szeres')
    expect(fn(2, 'szoros')).toEqual('szeres')
    expect(fn(5, 'szeres')).toEqual('szörös')
    expect(fn(0, 'szöröse')).toEqual('szorosa')
    expect(fn(1, 'szorosa')).toEqual('szerese')
    expect(fn(2, 'szorosa')).toEqual('szerese')
    expect(fn(5, 'szerese')).toEqual('szöröse')
    expect(fn(0, 'szörösét')).toEqual('szorosát')
    expect(fn(1, 'szorosát')).toEqual('szeresét')
    expect(fn(2, 'szorosát')).toEqual('szeresét')
    expect(fn(5, 'szeresét')).toEqual('szörösét')
    expect(fn(0, 'szörösére')).toEqual('szorosára')
    expect(fn(1, 'szorosára')).toEqual('szeresére')
    expect(fn(2, 'szorosára')).toEqual('szeresére')
    expect(fn(5, 'szeresére')).toEqual('szörösére')
    expect(fn(0, 'szörösének')).toEqual('szorosának')
    expect(fn(1, 'szorosának')).toEqual('szeresének')
    expect(fn(2, 'szorosának')).toEqual('szeresének')
    expect(fn(5, 'szeresének')).toEqual('szörösének')
    expect(fn(0, 'szöröséhez')).toEqual('szorosához')
    expect(fn(1, 'szorosához')).toEqual('szereséhez')
    expect(fn(2, 'szorosához')).toEqual('szereséhez')
    expect(fn(5, 'szereséhez')).toEqual('szöröséhez')
    expect(fn(0, 'szöröséből')).toEqual('szorosából')
    expect(fn(1, 'szorosából')).toEqual('szereséből')
    expect(fn(2, 'szorosából')).toEqual('szereséből')
    expect(fn(5, 'szereséből')).toEqual('szöröséből')
  })

  test('fractionSuffix', () => {
    const fn = fractionSuffix
    expect(fn(0, 'ad')).toEqual('d')
    expect(fn(-1, 'öd')).toEqual('ed')
    expect(fn(2, 'öd')).toEqual('ed')
    expect(fn(3, 'öd')).toEqual('ad')
    expect(fn(-5, 'ed')).toEqual('öd')
    expect(fn(6, 'ed')).toEqual('od')
    expect(fn(0, 'ada')).toEqual('da')
    expect(fn(-1, 'öde')).toEqual('ede')
    expect(fn(2, 'öde')).toEqual('ede')
    expect(fn(3, 'öde')).toEqual('ada')
    expect(fn(-5, 'ede')).toEqual('öde')
    expect(fn(6, 'ede')).toEqual('oda')
    expect(fn(0, 'eddel')).toEqual('ddal')
    expect(fn(-1, 'öddel')).toEqual('eddel')
    expect(fn(2, 'öddel')).toEqual('eddel')
    expect(fn(3, 'öddel')).toEqual('addal')
    expect(fn(-5, 'eddel')).toEqual('öddel')
    expect(fn(-6, 'eddel')).toEqual('oddal')
    expect(fn(0, 'adának')).toEqual('dának')
    expect(fn(-1, 'ödének')).toEqual('edének')
    expect(fn(2, 'ödének')).toEqual('edének')
    expect(fn(3, 'ödének')).toEqual('adának')
    expect(fn(-5, 'edének')).toEqual('ödének')
    expect(fn(-6, 'edének')).toEqual('odának')
    expect(fn(0, 'edével')).toEqual('dával')
    expect(fn(-1, 'ödével')).toEqual('edével')
    expect(fn(2, 'ödével')).toEqual('edével')
    expect(fn(3, 'ödével')).toEqual('adával')
    expect(fn(-5, 'edével')).toEqual('ödével')
    expect(fn(6, 'edével')).toEqual('odával')
    expect(fn(0, 'adszorosa')).toEqual('dszorosa')
    expect(fn(-1, 'ödszöröse')).toEqual('edszerese')
    expect(fn(2, 'ödszöröse')).toEqual('edszerese')
    expect(fn(3, 'ödszöröse')).toEqual('adszorosa')
    expect(fn(-5, 'edszerese')).toEqual('ödszöröse')
    expect(fn(-6, 'edszerese')).toEqual('odszorosa')
    expect(fn(1, 'ad')).toEqual('ed')
    expect(fn(10, 'ad')).toEqual('ed')
    expect(fn(100, 'ad')).toEqual('ad')
    expect(fn(1000, 'ad')).toEqual('ed')
    expect(fn(1_000_000, 'ad')).toEqual('mod')
    expect(fn(1_000_000_000, 'ad')).toEqual('od')
    expect(fn(1_000_000_000_000, 'ad')).toEqual('mod')
    expect(fn(1_000_000_000_000_000, 'ad')).toEqual('od')
  })

  test('generalSuffix', () => {
    const fn = generalSuffix
    expect(fn(0, 'unknown')).toEqual('unknown')
    expect(fn(0, 'ből')).toEqual('ból')
    expect(fn(-1, 'ból')).toEqual('ből')
    expect(fn(0, 'nek')).toEqual('nak')
    expect(fn(1, 'nak')).toEqual('nek')
    expect(fn(-0, 'höz')).toEqual('hoz')
    expect(fn(1, 'hoz')).toEqual('hez')
    expect(fn(2, 'hez')).toEqual('höz')
    expect(fn(-5, 'hez')).toEqual('höz')
    expect(fn(1, 'ra')).toEqual('re')
    expect(fn(2, 'ra')).toEqual('re')
    expect(fn(-3, 're')).toEqual('ra')
    expect(fn(1, 'ban')).toEqual('ben')
    expect(fn(2, 'ban')).toEqual('ben')
    expect(fn(-3, 'ben')).toEqual('ban')
  })

  test('convertSuffix', () => {
    const fn = convertSuffix
    expect(() => fn(0, 'ért')).toThrow('Invalid suffix: "ért"')
    expect(fn(0, 'as')).toEqual('s')
    expect(fn(1, 'as')).toEqual('es')
    expect(fn(2, 's')).toEqual('es')
    expect(fn(-3, 'es')).toEqual('as')
    expect(fn(4, 's')).toEqual('es')
    expect(fn(5, 'as')).toEqual('ös')
    expect(fn(-6, 'ös')).toEqual('os')
    expect(fn(7, 'ös')).toEqual('es')
    expect(fn(8, 'ös')).toEqual('as')
    expect(fn(9, 'as')).toEqual('es')
    expect(fn(-10, 'os')).toEqual('es')
    expect(fn(0, 'ből')).toEqual('ból')
    expect(fn(-1, 'ból')).toEqual('ből')
    expect(fn(0, 'nek')).toEqual('nak')
    expect(fn(1, 'nak')).toEqual('nek')
    expect(fn(-0, 'höz')).toEqual('hoz')
    expect(fn(1, 'hoz')).toEqual('hez')
    expect(fn(2, 'hez')).toEqual('höz')
    expect(fn(-5, 'hez')).toEqual('höz')
    expect(fn(1, 'ra')).toEqual('re')
    expect(fn(2, 'ra')).toEqual('re')
    expect(fn(-3, 're')).toEqual('ra')
    expect(fn(1, 'ban')).toEqual('ben')
    expect(fn(2, 'ban')).toEqual('ben')
    expect(fn(-3, 'ben')).toEqual('ban')
  })

  test('suffix', () => {
    const fn = suffixUtils['suffix']
    expect(() => fn(pln(0), pls('út'))).toThrow('Invalid suffix: "út"')
    expect(() => fn(pln(0), pls('et '))).toThrow('Invalid suffix: "et "')
    expect(() => fn(plf(0, 1), pls('et'))).toThrow('Invalid suffix: "et"')
    expect(fn(pln(-0), pls('öt'))).toEqual(pls('t'))
    expect(fn(pln(1), pls('t'))).toEqual(pls('et'))
    expect(fn(pln(-2), pls('et'))).toEqual(pls('t'))
    expect(fn(pln(5), pls('et'))).toEqual(pls('öt'))
    expect(fn(pln(-6), pls('öt'))).toEqual(pls('ot'))
    expect(fn(plf(3, 1), pls('adát'))).toEqual(pls('edét'))
    expect(fn(plf(3, 2), pls('adához'))).toEqual(pls('edéhez'))
    // WARNING: fractions will be simplified! -6/-8 = 3/4!!!
    expect(fn(plf(-6, -8), pls('adszorosához'))).toEqual(pls('edszereséhez'))
    expect(fn(plf(5, 6), pls('edének'))).toEqual(pls('odának'))
    expect(fn(plf(-6, 5), pls('adszorosára'))).toEqual(pls('ödszörösére'))
  })

  test('correctNumSuffix', () => {
    const fn = correctNumSuffix
    expect(fn('nullat')).toEqual('nullát')
    expect(fn('nullas')).toEqual('nullás')
    expect(fn('nullasokhoz')).toEqual('nullásokhoz')
    expect(fn('nullaban')).toEqual('nullában')
    expect(fn('nullad')).toEqual('nullad')
    expect(fn('nullaszor')).toEqual('nullaszor')
    expect(fn('nullahoz')).toEqual('nullához')
    expect(fn('egygyel')).toEqual('eggyel')
    expect(fn('kettőesével')).toEqual('kettesével')
    expect(fn('kettőszer')).toEqual('kétszer')
    expect(fn('kettőt')).toEqual('kettőt')
    expect(fn('kettőed')).toEqual('ketted')
    expect(fn('háromas')).toEqual('hármas')
    expect(fn('háromad')).toEqual('harmad')
    expect(fn('háromat')).toEqual('hármat')
    expect(fn('négygyel')).toEqual('néggyel')
    expect(fn('négyed')).toEqual('negyed')
    expect(fn('héted')).toEqual('heted')
    expect(fn('hétet')).toEqual('hetet')
    expect(fn('hétes')).toEqual('hetes')
    expect(fn('tízed')).toEqual('tized')
    expect(fn('tízes')).toEqual('tízes')
    expect(fn('tízet')).toEqual('tizet')
    expect(fn('húszad')).toEqual('huszad')
    expect(fn('húszat')).toEqual('huszat')
    expect(fn('húszszor')).toEqual('hússzor')
    expect(fn('húszszal')).toEqual('hússzal')
    expect(fn('ezeret')).toEqual('ezret')
    expect(fn('ezered')).toEqual('ezred')
    expect(fn('milliómod')).toEqual('milliomod')
  })

  test('num-suffix', () => {
    const fn = suffixUtils['num-suffix']
    expect(fn(pln(0), pls('öt'))).toStrictEqual(pls('nullát'))
    expect(fn(pln(1), pls('t'))).toStrictEqual(pls('egyet'))
    expect(fn(pln(2), pls('ashoz'))).toStrictEqual(pls('ketteshez'))
    expect(fn(pln(-3), pls('et'))).toStrictEqual(pls('mínusz hármat'))
    expect(fn(pln(20), pls('szer'))).toStrictEqual(pls('hússzor'))
    expect(fn(pln(-2), pls('szorosára'))).toStrictEqual(pls('mínusz kétszeresére'))
    expect(fn(pln(1000), pls('asokkal'))).toStrictEqual(pls('ezresekkel'))
    expect(fn(pln(-2010), pls('öt'))).toStrictEqual(pls('mínusz kétezer-tizet'))
    expect(fn(pln(234_001_000_000), pls('d'))).toStrictEqual(
      pls('kétszázharmincnégymilliárd-egymilliomod'),
    )
    expect(fn(plf(3, 2), pls('adához'))).toEqual(pls('három kettedéhez'))
    // WARNING: fractions will be simplified! -6/-8 = 3/4!!!
    expect(fn(plf(-6, -8), pls('adszorosához'))).toEqual(pls('három negyedszereséhez'))
    expect(fn(plf(5, 6), pls('edének'))).toEqual(pls('öt hatodának'))
    expect(fn(plf(-6, 5), pls('adszorosára'))).toEqual(pls('mínusz hat ötödszörösére'))
  })
})
