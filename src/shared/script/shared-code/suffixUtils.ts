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
  const replacement2 = lowPitch ? 'a' : 'e'
  const replacement3 = n % 10 === 5 ? 'ö' : lowPitch ? 'o' : 'e'
  const replacement2low = lowPitch ? 'ó' : 'ő'
  // special cases
  let replacement5 = ''
  if (nZeros < 6) {
    if (n === 0) {
      replacement5 = ''
    } else if (n % 10 === 5) {
      replacement5 = 'ö'
    } else if (n % 10 === 6) {
      replacement5 = 'o'
    } else {
      replacement5 = replacement2
    }
  } else {
    // big numbers (see: https://hu.wikipedia.org/wiki/T%C3%ADz_hatv%C3%A1nyai)
    const nGroups = Math.floor(nZeros / 3)
    replacement5 = nGroups % 2 === 0 ? '' : 'o'
  }
  sfx = sfx.replace(/^[aáeoö]?(?=s)/g, replacement5) // -s/as/es/os/ös
  sfx = sfx.replace(/(?<=s)[eoö](?=k)/g, replacement3) // -sok/sek/sök
  sfx = sfx.replace(/(?<=k)[ae](?=t)/g, replacement2) // -kat/ket
  sfx = sfx.replace(/(?<=n)[ae](?=k)/g, replacement2) // -nak/nek
  sfx = sfx.replace(/(?<=b)[óő](?=l)/g, replacement2low) // -ból/ből
  sfx = sfx.replace(/(?<=h)[eoö](?=z)/g, replacement3) // -hoz/hez/höz
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
