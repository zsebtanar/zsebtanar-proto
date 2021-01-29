import { PLNumber, PLFractionNumber, plString, PLString } from 'pocket-lisp-stdlib'
import { assertInteger, typeCheck } from './utils'
import { baseNum2text } from './langUtils'

export function getLastDigit(num: number): number {
  const n = Math.abs(num)
  return n % 10
}

export function getLastNonZeroDigit(num: number): number {
  if (num === 0) {
    return 0
  } else {
    let lastDigit = getLastDigit(num)
    while (lastDigit === 0) {
      num = num / 10
      lastDigit = getLastDigit(num)
    }
    return lastDigit
  }
}

/**
 * Number of trailing zeros after first non-zero digit (e.g. 230000 -> 4)
 */
export function trailingZeros(num: number): number {
  assertInteger(num)
  if (Math.abs(num) < 10) {
    return 0
  }
  let nZeros = 0
  while (num % 10 === 0) {
    num /= 10
    nZeros++
  }
  return nZeros
}

/**
 * Check if big number has even number groups
 * (see: https://hu.wikipedia.org/wiki/T%C3%ADz_hatv%C3%A1nyai)
 */
export function isNumberGroupEven(n: number): boolean {
  const nZeros = trailingZeros(n)
  const nGroups = Math.floor(nZeros / 3)
  return nGroups % 2 === 0
}

/**
 * Check if number is high pitch (e/i) or low pitch (a/o/u)
 */
export function pitch(n: number): 'low' | 'high' {
  assertInteger(n)
  const nZeros = trailingZeros(n)
  if (nZeros <= 1) {
    const highPitch = nZeros === 0 ? [1, 2, 4, 5, 7, 9] : [1, 4, 5, 7, 9]
    const lastDigit = getLastNonZeroDigit(n)
    return highPitch.includes(lastDigit) ? 'high' : 'low'
  } else if (nZeros >= 3 && nZeros <= 5) {
    return 'high'
  }
  return 'low'
}

/**
 * Get vowel for given suffix
 */
export function suffixVowel(n: number, vowelType: string): string {
  const isLowPitch = pitch(n) === 'low'
  let vowel = ''
  const type = vowelType.split('').sort().join('')
  if (type === 'ae') {
    // nak/nek
    vowel = isLowPitch ? 'a' : 'e'
  } else if (type === 'áé') {
    // át/ét
    vowel = isLowPitch ? 'á' : 'é'
  } else if (type === 'eoö') {
    // szor/szer/ször
    const lastDigit = getLastDigit(n)
    vowel = lastDigit === 5 || lastDigit === 2 ? 'ö' : isLowPitch ? 'o' : 'e'
  } else if (type === 'óő') {
    // ból/ből
    vowel = isLowPitch ? 'ó' : 'ő'
  } else {
    throw new Error(`Invalid vowel type: "${vowelType}"`)
  }
  return vowel
}

/**
 * Dativ suffix (at/et/öt/t)
 */
export function dativSuffix(n: number): string {
  const nZeros = trailingZeros(n)
  if (nZeros < 6) {
    const lastDigit = getLastDigit(n)
    const exceptions = {
      0: 't',
      2: 't',
      5: 'öt',
      6: 'ot',
    }
    // handle single digit exceptions
    if (nZeros === 0 && lastDigit in exceptions) {
      return exceptions[lastDigit]
    } else {
      return pitch(n) === 'high' ? 'et' : 'at'
    }
  } else if (nZeros === 9) {
    return 'ot'
  } else {
    return 't'
  }
}

/**
 * Place value suffix (as/es/asoknak/eseket)
 */
export function placeValueSuffix(n: number, sfx: string): string {
  if (!/^[aáeoö]?s/g.test(sfx)) {
    throw new Error(`Invalid suffix: "${sfx}"`)
  }
  const lastDigit = getLastDigit(n)
  const lowPitch = pitch(n) === 'low'
  const nZeros = trailingZeros(n)

  // special cases
  let replacement = ''
  if (nZeros < 6) {
    if (n === 0) {
      replacement = ''
    } else if (lastDigit === 5) {
      replacement = 'ö'
    } else if (lastDigit === 6) {
      replacement = 'o'
    } else {
      replacement = lowPitch ? 'a' : 'e'
    }
  } else {
    replacement = isNumberGroupEven(n) ? '' : 'o'
  }
  sfx = sfx.replace(/^[aáeoö]?s/g, `${replacement}s`) // -s/as/es/os/ös
  sfx = sfx.replace(/s[eoö]k/g, `s${suffixVowel(n, 'oeö')}k`) // -sok/sek/sök
  sfx = sfx.replace(/k[ae]t/g, `k${suffixVowel(n, 'ae')}t`) // -kat/ket
  sfx = sfx.replace(/k[ae]l/g, `k${suffixVowel(n, 'ae')}l`) // -kal/kel
  // replace trailing 2 with 1 to avoid special case: 2-höz vs. 2-esekhez
  sfx = generalSuffix(lastDigit === 2 ? n - 1 : n, sfx)
  return sfx
}

/**
 * With suffix (val/vel)
 */
export function withSuffix(n: number): string {
  const nZeros = trailingZeros(n)
  if (nZeros <= 1) {
    const lastDigit = getLastNonZeroDigit(n)
    const suffixes =
      nZeros === 0
        ? {
            0: 'val',
            1: 'gyel',
            2: 'vel',
            3: 'mal',
            4: 'gyel',
            5: 'tel',
            6: 'tal',
            7: 'tel',
            8: 'cal',
            9: 'cel',
          }
        : {
            1: 'zel',
            2: 'szal',
            3: 'cal',
            4: 'nel',
            5: 'nel',
            6: 'nal',
            7: 'nel',
            8: 'nal',
            9: 'nel',
          }
    return suffixes[lastDigit]
  } else if (nZeros === 2) {
    return 'zal'
  } else if (nZeros < 6) {
    return 'rel'
  } else {
    return isNumberGroupEven(n) ? 'val' : 'dal'
  }
}

/**
 * Multiplication suffix (szor/szer/ször)
 */
export function multSuffix(n: number, sfx: string): string {
  // replace trailing 2 with 4 to avoid special case: 2-höz vs. 2-szer
  const lastDigit = getLastDigit(n)
  n = lastDigit === 2 ? Math.abs(n) + 2 : n
  sfx = sfx.replace(/sz[oeö]r/g, `sz${suffixVowel(n, 'oeö')}r`) // -szor/szer/ször
  sfx = sfx.replace(/r[oeö]s/g, `r${suffixVowel(n, 'oeö')}s`) // -os/es/ös
  sfx = sfx.replace(/s[ae]$/g, `s${suffixVowel(n, 'ae')}`) // -sa/se
  sfx = sfx.replace(/s[áé]/g, `s${suffixVowel(n, 'áé')}`) // -sá/sé

  // replace trailing 5 with 7 to avoid special case: 5-höz vs. 5-szöröséhez
  n = lastDigit === 5 ? Math.abs(n) + 2 : n
  sfx = generalSuffix(n, sfx)
  return sfx
}

/**
 * Fraction suffix (ad/ed)
 */
export function fractionSuffix(n: number, sfx: string): string {
  const lastDigit = getLastDigit(n)
  const nZeros = trailingZeros(n)

  // special cases
  let replacement = ''
  if (n === 0) {
    replacement = ''
  } else if (nZeros <= 1) {
    replacement = lastDigit === 5 ? 'ö' : lastDigit === 6 ? 'o' : suffixVowel(n, 'ae')
  } else if (nZeros < 6) {
    replacement = nZeros === 2 ? 'a' : 'e'
  } else {
    replacement = isNumberGroupEven(n) ? 'mo' : 'o'
  }
  sfx = sfx.replace(/^[aemoö]?d/g, `${replacement}d`) // -d/ad/ed/od/öd/mod
  sfx = sfx.replace(/d[ae]$/g, `d${suffixVowel(n, 'ae')}`) // -da/de
  sfx = sfx.replace(/d[áé]/g, `d${suffixVowel(n, 'áé')}`) // -dá/dé
  sfx = sfx.replace(/d[ae]l/g, `d${suffixVowel(n, 'ae')}l`) // -dal/del
  sfx = sfx.replace(/v[ae]l/g, `v${suffixVowel(n, 'ae')}l`) // -val/vel

  sfx = multSuffix(n, sfx) // -adszorosa/edszerese
  return sfx
}

/**
 * General suffixes (nak/nek, ból/ből, hoz/hez/höz)
 */
export function generalSuffix(n: number, sfx: string): string {
  sfx = sfx.replace(/b[óő]l/g, `b${suffixVowel(n, 'óő')}l`) // -ból/ből
  sfx = sfx.replace(/n[ae]k/g, `n${suffixVowel(n, 'ae')}k`) // -nak/nek
  sfx = sfx.replace(/h[eoö]z/g, `h${suffixVowel(n, 'oeö')}z`) // -hoz/hez/höz
  sfx = sfx.replace(/r[ae]$/g, `r${suffixVowel(n, 'ae')}`) // -ra/re
  return sfx
}

export function convertSuffix(n: number, sfx: string): string {
  if (/^[aáeoöő]?t$/g.test(sfx)) {
    return dativSuffix(n)
  } else if (/^[aáeoö]?s$/g.test(sfx) || /^[aáeoö]?s[^z]/g.test(sfx)) {
    return placeValueSuffix(n, sfx)
  } else if (/^[acdegmnrstvyz]{2,}l$/g.test(sfx)) {
    return withSuffix(n)
  } else if (/^sz[oeö]r/g.test(sfx)) {
    return multSuffix(n, sfx)
  } else if (/^[aemoö]?d/g.test(sfx)) {
    return fractionSuffix(n, sfx)
  } else if (/^b[óő]l$/g.test(sfx) || /^n[ae]k$/g.test(sfx) || /^h[oeö]z$/g.test(sfx)) {
    return generalSuffix(n, sfx)
  } else {
    throw new Error(`Invalid suffix: "${sfx}"`)
  }
}

export const suffix = (num: PLNumber | PLFractionNumber, sfx: PLString): PLString => {
  typeCheck(PLString, sfx)
  let n: number
  if (num.constructor === PLNumber) {
    n = num.value
  } else if (num.constructor === PLFractionNumber) {
    if (/^[aemoö]?d/g.test(sfx.value)) {
      n = num.denominator
    } else {
      throw new Error(`Invalid suffix: "${sfx.value}"`)
    }
  } else {
    throw new Error(
      `Expected '${PLNumber.name}' or '${PLFractionNumber.name}', but got '${num.constructor.name}'.`,
    )
  }
  const sfxCorrect = convertSuffix(n, sfx.value)
  return plString(sfxCorrect)
}

export function correctNumSuffix(numSuffix: string): string {
  numSuffix = numSuffix.replace(/nulla(?!d)(?!sz)/g, 'nullá')
  numSuffix = numSuffix.replace(/kettő(?=e)/g, 'kett')
  numSuffix = numSuffix.replace(/kettő(?=szer)/g, 'két')
  numSuffix = numSuffix.replace(/hároma(?!d)/g, 'hárma')
  numSuffix = numSuffix.replace('háromad', 'harmad')
  numSuffix = numSuffix.replace('négyed', 'negyed')
  numSuffix = numSuffix.replace(/héte(?=d|t|s)/g, 'hete')
  numSuffix = numSuffix.replace(/tíze(?=d|t)/g, 'tize')
  numSuffix = numSuffix.replace(/húsza(?=d|t)/g, 'husza')
  numSuffix = numSuffix.replace(/ezere(?=s|d|t)/g, 'ezre')
  numSuffix = numSuffix.replace('illiómod', 'illiomod')
  numSuffix = numSuffix.replace('gygy', 'ggy')
  numSuffix = numSuffix.replace('szsz', 'ssz')
  return numSuffix
}

export const numSuffix = (num: PLNumber | PLFractionNumber, sfx: PLString): PLString => {
  typeCheck(PLString, sfx)
  const suffixText = suffix(num, sfx).value
  let numText = ''
  if (num.constructor === PLNumber) {
    numText = baseNum2text(num.value)
  } else if (num.constructor === PLFractionNumber) {
    const numeratorText = baseNum2text(num.numerator)
    const denominatorText = baseNum2text(num.denominator)
    numText = `${numeratorText} ${denominatorText}`
  } else {
    throw new Error(
      `Expected '${PLNumber.name}' or '${PLFractionNumber.name}', but got '${num.constructor.name}'.`,
    )
  }
  const numSuffixText = correctNumSuffix(`${numText}${suffixText}`)
  return plString(numSuffixText)
}

export const suffixUtils = {
  suffix,
  ['num-suffix']: numSuffix,
}
