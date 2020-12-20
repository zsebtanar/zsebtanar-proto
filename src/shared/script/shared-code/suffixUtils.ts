import { PLNumber, plString, PLString } from 'pocket-lisp-stdlib'
import { none } from 'ramda'
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
  const n = Math.abs(value)
  const lowPitch = pitch(n) === 'low'
  const nZeros = trailingZeros(n)
  const exceptions = {
    0: '',
    5: 'ö',
    6: 'o',
  }
  const replacement = lowPitch ? 'a' : 'e'
  // special cases
  let replacementES = ''
  if (nZeros < 6) {
    if (n === 0) {
      replacementES = ''
    } else if (n % 10 === 5) {
      replacementES = 'ö'
    } else if (n % 10 === 6) {
      replacementES = 'o'
    } else {
      replacementES = replacement
    }
  } else {
    // big numbers (see: https://hu.wikipedia.org/wiki/T%C3%ADz_hatv%C3%A1nyai)
    const nGroups = Math.floor(nZeros / 3)
    replacementES = nGroups % 2 === 0 ? '' : 'o'
  }
  const replacementEK = n % 10 === 5 ? 'ö' : lowPitch ? 'o' : 'e'
  const replacementBOL = lowPitch ? 'ó' : 'ő'
  sfx = sfx.replace(/^[aáeoö]?(?=s)/g, replacementES) // -as/es/os/ös
  sfx = sfx.replace(/(?<=s)[eoö](?=k)/g, replacementEK) // -sok/sek/sök
  sfx = sfx.replace(/(?<=k)[ae](?=t)/g, replacement) // -kat/ket
  sfx = sfx.replace(/(?<=n)[ae](?=k)/g, replacement) // -nak/nek
  sfx = sfx.replace(/(?<=b)[óő](?=l)/g, replacementBOL) // -ból/ből
  sfx = sfx.replace(/(?<=h)[eoö](?=z)/g, replacementEK) // -hoz/hez/höz
  return sfx
}

export function convertSuffix(value: number, sample: string): string {
  if (/^[aáeoöő]?t$/g.test(sample)) {
    return dativusSuffix(value)
  } else if (/^[aáeoö]?s/g.test(sample)) {
    return placeValueSuffix(value, sample)
  }
  throw new Error(`Invalid suffix: "${sample}"`)
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
