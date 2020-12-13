import { PLNumber, PLFractionNumber, plString, PLString } from 'pocket-lisp-stdlib'
import { assertInteger, typeCheck } from './utils'

const suffixTimes = (num: number): string => {
  assertInteger(num)

  const absNum = Math.abs(num)

  switch (absNum % 10) {
    case 1:
    case 2:
    case 4:
    case 7:
    case 9:
      return 'szer'
    case 3:
    case 6:
    case 8:
      return 'szor'
    case 5:
      return 'ször'
  }

  switch ((absNum / 10) % 10) {
    case 1:
    case 4:
    case 5:
    case 7:
    case 9:
      return 'szer'
    case 2:
    case 3:
    case 6:
    case 8:
      return 'szor'
  }

  if (absNum == 0) {
    return 'szor'
  } else if (100 <= absNum && absNum < 1000) {
    return 'szor'
  } else if (1000 <= absNum && absNum < 1000000) {
    return 'szer'
  } else {
    return 'szor'
  }
}

/**
 * Add modified suffix 'times' to number (szorosára/szeresére/szörösére)
 *
 * @param num Number (< 10^600)
 *
 * @return string $suffix Suffix
 */
const suffixTimes2 = (num: number): string => {
  assertInteger(num)

  const absNum = Math.abs(num)

  switch (absNum % 10) {
    case 1:
    case 2:
    case 4:
    case 7:
    case 9:
      return 'szeresére'
    case 3:
    case 6:
    case 8:
      return 'szorosára'
    case 5:
      return 'szörösére'
  }

  switch ((absNum / 10) % 10) {
    case 1:
    case 4:
    case 5:
    case 7:
    case 9:
      return 'szeresére'
    case 2:
    case 3:
    case 6:
    case 8:
      return 'szorosára'
  }

  if (absNum == 0) {
    return 'szorosára'
  } else if (100 <= absNum && absNum < 1000) {
    return 'szorosára'
  } else if (1000 <= absNum && absNum < 1000000) {
    return 'szeresére'
  } else {
    return 'szorosára'
  }
}

/**
 * Add modified suffix 'th' to number (od/ed/öd)
 *
 * @param num Fraction number
 * @return string $suffix Suffix
 */
const baseSuffixFraction = (num: number): string => {
  const absNum = Math.abs(num)

  switch (absNum % 10) {
    case 1:
    case 2:
    case 4:
    case 7:
    case 9:
      return 'ed'
    case 3:
    case 8:
      return 'ad'
    case 6:
      return 'od'
    case 5:
      return 'öd'
  }

  switch ((absNum / 10) % 10) {
    case 1:
    case 4:
    case 5:
    case 7:
    case 9:
      return 'ed'
    case 2:
    case 3:
    case 6:
    case 8:
      return 'ad'
  }

  if (absNum == 0) {
    return 'ad'
  } else if (100 <= absNum && absNum < 1000) {
    return 'ad'
  } else if (1000 <= absNum && absNum < 1000000) {
    return 'ed'
  } else {
    return 'od'
  }
}

const format = (fn: (number) => string) => (num: PLNumber | PLFractionNumber): PLString => {
  let result = ''
  if (num instanceof PLNumber) {
    if (Number.isInteger(num.value)) {
      result = fn(num.value)
    } else {
      const floatPart = parseInt(num.value.toString().split('.')[1] || '0')

      if (floatPart > 0) {
        result = fn(floatPart)
      } else {
        result = ''
      }
    }
  } else if (num instanceof PLFractionNumber) {
    result = fn(num.denominator)
  }
  return plString(result)
}

/**
 * Add article to number
 *
 *
 * @param value
 */
function article(value: number): string {
  if (value < 0) {
    return 'a'
  } else {
    const text = baseNum2text(value)
    return !text ? '' : /^[aáeéiíoóöőuúüű]/.test(text) ? 'az' : 'a'
  }
}

/**
 * Write down number with letters
 *
 *
 * @return string $num_text Number with text
 * @param value
 */
function baseNum2text(value: number) {
  assertInteger(value)
  const absNum = Math.abs(value)
  if (absNum === 0) {
    return 'nulla'
  }

  const digits = absNum.toString().split('').reverse()

  const numGroups = ['', 'ezer', 'millió', 'milliárd']
  const num1a = ['', 'egy', 'kettő', 'három', 'négy', 'öt', 'hat', 'hét', 'nyolc', 'kilenc']
  const num1b = ['', '', 'két', 'három', 'négy', 'öt', 'hat', 'hét', 'nyolc', 'kilenc']
  const num2a = [
    '',
    'tizen',
    'huszon',
    'harminc',
    'negyven',
    'ötven',
    'hatvan',
    'hetven',
    'nyolcvan',
    'kilencven',
  ]
  const num2b = [
    '',
    'tíz',
    'húsz',
    'harminc',
    'negyven',
    'ötven',
    'hatvan',
    'hetven',
    'nyolcvan',
    'kilencven',
  ]

  const text = digits.reduce(
    ({ group, text }, digit, idx, digits) => {
      if (idx % 3 == 0) {
        text = numGroups[group] + text
        if (absNum > 2000 && group > 0) text = `${text}-`
        text = num1a[digit] + text
        group++
      } else if (idx % 3 === 1) {
        const isWhole = digits[idx - 1] === '0'
        text = (isWhole ? num2b : num2a)[digit] + text
      } else if (idx % 3 === 2) {
        text = `${num1b[digit]}száz${text}`
      }
      return { group, text }
    },
    { group: 0, text: '' },
  ).text

  return text
    .replace('egyezer', 'ezer')
    .replace('kettőezer', 'kétezer')
    .replace('kettőmillió', 'kétmillió')
    .replace('kettőmilliárd', 'kétmilliárd')
}

function num2text(num: PLNumber | PLFractionNumber): PLString {
  let result = ''
  if (num instanceof PLNumber) {
    if (Number.isInteger(num.value)) {
      result = baseNum2text(num.value)
    }
  } else if (num instanceof PLFractionNumber) {
    assertInteger(num.denominator)

    result = `${baseNum2text(num.numerator)} ${baseNum2text(num.denominator)}${baseSuffixFraction(
      num.denominator,
    )}`
  }
  return plString(result)
}

export function convertSuffix(value: number, sample: string): string {
  if (/^[aáeoöő]?t$/g.test(sample)) {
    return dativus(value)
  } else if (/^[aáe]?s/g.test(sample)) {
    return placeValue(value, sample)
  }
  throw new Error(`Invalid suffix: "${sample}"`)
}

export function dativus(value: number): string {
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

export function placeValue(value: number, sfx: string): string {
  // suffix: as/es/asoknak/eseket etc.
  const n = Math.abs(value)
  const lowPitch = pitch(n) === 'low'
  const exceptions = {
    0: '',
    5: 'ö',
    6: 'o',
  }
  const replacement = lowPitch ? 'a' : 'e'
  const replacementES = n % 10 in exceptions ? exceptions[n % 10] : replacement
  const replacementEK = n % 10 === 5 ? 'ö' : lowPitch ? 'o' : 'e'
  const replacementBOL = lowPitch ? 'ó' : 'ő'
  sfx = sfx.replace(/^[aáeö]?(?=s)/g, replacementES) // -as/es/ös
  sfx = sfx.replace(/(?<=s)[eoö](?=k)/g, replacementEK) // -sok/sek/sök
  sfx = sfx.replace(/(?<=k)[ae](?=t)/g, replacement) // -kat/ket
  sfx = sfx.replace(/(?<=n)[ae](?=k)/g, replacement) // -nak/nek
  sfx = sfx.replace(/(?<=b)[óő](?=l)/g, replacementBOL) // -ból/ből
  sfx = sfx.replace(/(?<=h)[eoö](?=z)/g, replacementEK) // -hoz/hez/höz
  return sfx
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

export const suffix = (num: PLNumber, sfx: PLString): PLString => {
  typeCheck(PLNumber, num)
  typeCheck(PLString, sfx)
  const sfxCorrect = convertSuffix(num.value, sfx.value)
  return plString(sfxCorrect)
}

export const suffixUtils = {
  suffix,
}
