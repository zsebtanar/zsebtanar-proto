import { PLNumber, plString, PLString } from 'pocket-lisp-stdlib'
import { assertInteger, typeCheck } from './utils'

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

export function trailingZeros(num: number): number {
  // number of trailing zeros after first digit
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

export function isNumberGroupEven(n: number): boolean {
  // big numbers (see: https://hu.wikipedia.org/wiki/T%C3%ADz_hatv%C3%A1nyai)
  const nZeros = trailingZeros(n)
  const nGroups = Math.floor(nZeros / 3)
  return nGroups % 2 === 0
}

export function pitch(n: number): string {
  // check if number is high pitch (e/i) or low pitch (a/o/u)
  assertInteger(n)
  const nZeros = trailingZeros(n)
  if (nZeros <= 1) {
    const highPitch = nZeros === 0 ? [1, 2, 4, 5, 7, 9] : [1, 4, 5, 7, 9]
    const lastDigit = getLastNonZeroDigit(n)
    return highPitch.indexOf(lastDigit) >= 0 ? 'high' : 'low'
  } else if (nZeros >= 3 && nZeros <= 5) {
    return 'high'
  }
  return 'low'
}

export function suffixVowel(n: number, vowelType: string): string {
  const lowPitch = pitch(n) === 'low'
  let vowel = ''
  const type = vowelType.split('').sort().join('')
  if (type === 'ae') {
    vowel = lowPitch ? 'a' : 'e'
  } else if (type === 'eoö') {
    const lastDigit = getLastDigit(n)
    vowel = lastDigit === 5 || lastDigit === 2 ? 'ö' : lowPitch ? 'o' : 'e'
  } else if (type === 'óő') {
    vowel = lowPitch ? 'ó' : 'ő'
  } else {
    throw new Error(`Invalid vowel type: "${vowelType}"`)
  }
  return vowel
}

export function dativusSuffix(n: number): string {
  // suffix: at/et/öt/t
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

export function placeValueSuffix(n: number, sfx: string): string {
  // suffix: as/es/asoknak/eseket etc.
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
  sfx = sfx.replace(/^[aáeoö]?(?=s)/g, replacement) // -s/as/es/os/ös
  sfx = sfx.replace(/(?<=s)[eoö](?=k)/g, suffixVowel(n, 'oeö')) // -sok/sek/sök
  sfx = sfx.replace(/(?<=k)[ae](?=t|l)/g, suffixVowel(n, 'ae')) // -kat/ket/kal/kel
  // replace trailing 2 with 1 to avoid special case: 2-höz vs. 2-esekhez
  sfx = generalSuffix(lastDigit === 2 ? n - 1 : n, sfx)
  return sfx
}

export function withSuffix(n: number): string {
  // suffix: val/vel
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

export function generalSuffix(n: number, sfx: string): string {
  // suffix: nak/nek, ból/ből, hoz/hez/höz
  sfx = sfx.replace(/(?<=b)[óő](?=l)/g, suffixVowel(n, 'óő')) // -ból/ből
  sfx = sfx.replace(/(?<=n)[ae](?=k)/g, suffixVowel(n, 'ae')) // -nak/nek
  sfx = sfx.replace(/(?<=h)[eoö](?=z)/g, suffixVowel(n, 'oeö')) // -hoz/hez/höz
  return sfx
}

export function convertSuffix(n: number, sfx: string): string {
  if (/^[aáeoöő]?t$/g.test(sfx)) {
    return dativusSuffix(n)
  } else if (/^[aáeoö]?s/g.test(sfx)) {
    return placeValueSuffix(n, sfx)
  } else if (/^[acdegmnrstvyz]{2,}l$/g.test(sfx)) {
    return withSuffix(n)
  } else if (/^b[óő]l$/g.test(sfx) || /^n[ae]k$/g.test(sfx) || /^h[oeö]z$/g.test(sfx)) {
    return generalSuffix(n, sfx)
  } else {
    // TODO: fractionSuffix (ad/ed)
    // TODO: multiplySuffix (szorosára)
    throw new Error(`Invalid suffix: "${sfx}"`)
  }
}

export const suffix = (num: PLNumber, sfx: PLString): PLString => {
  typeCheck(PLNumber, num)
  typeCheck(PLString, sfx)
  const sfxCorrect = convertSuffix(num.value, sfx.value)
  return plString(sfxCorrect)
}

export const suffixUtils = {
  suffix,
}
