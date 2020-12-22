import { PLNumber, plString, PLString } from 'pocket-lisp-stdlib'
import { assertInteger, typeCheck } from './utils'

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

export function pitch(num: number): string {
  // check if number is high pitch (e/i) or low pitch (a/o/u)
  assertInteger(num)
  const nZeros = trailingZeros(num)
  if (nZeros <= 1) {
    const highPitch = nZeros === 0 ? [1, 2, 4, 5, 7, 9] : [1, 4, 5, 7, 9]
    const lastDigit = nZeros === 0 ? Math.abs(num % 10) : Math.abs((num / 10) % 10)
    return highPitch.indexOf(lastDigit) >= 0 ? 'high' : 'low'
  } else if (nZeros >= 3 && nZeros <= 5) {
    return 'high'
  }
  return 'low'
}

export function suffixVowel(num: number, vowelType: string): string {
  const n = Math.abs(num)
  const lowPitch = pitch(n) === 'low'
  let vowel = ''
  const type = vowelType.split('').sort().join('')
  if (type === 'ae') {
    vowel = lowPitch ? 'a' : 'e'
  } else if (type === 'eoö') {
    vowel = n % 10 === 5 ? 'ö' : lowPitch ? 'o' : 'e'
  } else if (type === 'óő') {
    vowel = lowPitch ? 'ó' : 'ő'
  } else {
    throw new Error(`Invalid vowel type: "${vowelType}"`)
  }
  return vowel
}

export function dativusSuffix(value: number): string {
  // suffix: at/et/öt/t
  const n = Math.abs(value)
  const nZeros = trailingZeros(n)
  if (nZeros < 6) {
    const lastDigit = n % 10
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

export function placeValueSuffix(value: number, sfx: string): string {
  // suffix: as/es/asoknak/eseket etc.
  if (!/^[aáeoö]?s/g.test(sfx)) {
    throw new Error(`Invalid suffix: "${sfx}"`)
  }
  const n = Math.abs(value)
  const lowPitch = pitch(n) === 'low'
  const nZeros = trailingZeros(n)

  // special cases
  let replacement = ''
  if (nZeros < 6) {
    if (n === 0) {
      replacement = ''
    } else if (n % 10 === 5) {
      replacement = 'ö'
    } else if (n % 10 === 6) {
      replacement = 'o'
    } else {
      replacement = lowPitch ? 'a' : 'e'
    }
  } else {
    // big numbers (see: https://hu.wikipedia.org/wiki/T%C3%ADz_hatv%C3%A1nyai)
    const nGroups = Math.floor(nZeros / 3)
    replacement = nGroups % 2 === 0 ? '' : 'o'
  }
  sfx = sfx.replace(/^[aáeoö]?(?=s)/g, replacement) // -s/as/es/os/ös
  sfx = sfx.replace(/(?<=s)[eoö](?=k)/g, suffixVowel(n, 'oeö')) // -sok/sek/sök
  sfx = sfx.replace(/(?<=k)[ae](?=t)/g, suffixVowel(n, 'ae')) // -kat/ket
  sfx = sfx.replace(/(?<=n)[ae](?=k)/g, suffixVowel(n, 'ae')) // -nak/nek
  sfx = sfx.replace(/(?<=b)[óő](?=l)/g, suffixVowel(n, 'óő')) // -ból/ből
  sfx = sfx.replace(/(?<=h)[eoö](?=z)/g, suffixVowel(n, 'oeö')) // -hoz/hez/höz
  return sfx
}

export function generalSuffix(value: number, sfx: string): string {
  // suffix: nak/nek, ból/ből, hoz/hez/höz
  const n = Math.abs(value)
  if (/^b[óő]l$/g.test(sfx)) {
    sfx = sfx.replace(/(?<=b)[óő](?=l)/g, suffixVowel(n, 'óő')) // -ból/ből
  } else if (/^n[ae]k$/g.test(sfx)) {
    sfx = sfx.replace(/(?<=n)[ae](?=k)/g, suffixVowel(n, 'ae')) // -nak/nek
  } else if (/^h[oeö]z$/g.test(sfx)) {
    sfx = sfx.replace(/(?<=h)[eoö](?=z)/g, suffixVowel(n, 'oeö')) // -hoz/hez/höz
  } else {
    throw new Error(`Invalid suffix: "${sfx}"`)
  }
  return sfx
}

export function convertSuffix(value: number, sample: string): string {
  if (/^[aáeoöő]?t$/g.test(sample)) {
    return dativusSuffix(value)
  } else if (/^[aáeoö]?s/g.test(sample)) {
    return placeValueSuffix(value, sample)
  } else {
    // TODO: withSuffix (mal/gyel)
    // TODO: fractionSuffix (ad/ed)
    // TODO: multiplySuffix (szorosára)
    return generalSuffix(value, sample)
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
