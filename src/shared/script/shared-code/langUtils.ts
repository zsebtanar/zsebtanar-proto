import { PLNumber, PLFractionNumber, plString, PLString } from 'pocket-lisp-stdlib'
import { assertInteger } from './utils'

const abbreviations = {
  HU: {
    centiliter: 'cl',
    centiméter: 'cm',
    deciliter: 'dl',
    deciméter: 'dm',
    dekagram: 'dkg',
    gram: 'g',
    hektoliter: 'hl',
    kilogram: 'kg',
    kilométer: 'km',
    liter: 'l',
    másodperc: 'mp',
    méter: 'm',
    milligram: 'mg',
    milliliter: 'ml',
    milliméter: 'mm',
    óra: 'ó',
    perc: 'p',
    tonna: 't',
  },
}

export function abbreviate(lan: PLString, str: PLString): PLString {
  const abbrDict = abbreviations[lan.value] || {}
  const abbr = abbrDict[str.value] || str.value
  return plString(abbr)
}

const translations = {
  HU: {
    ó: 'h',
    óra: 'h',
    hüvelyk: 'in',
    láb: 'ft',
    p: 'min',
    mérföld: 'mi',
    mp: 's',
    tonna: 'ton',
    hét: 'week',
  },
}

export function translate(lan: PLString, str: PLString): PLString {
  const abbr = abbreviate(lan, str)
  const transDict = translations[lan.value] || {}
  const trans = transDict[abbr.value] || abbr.value
  return plString(trans)
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
export function baseNum2text(value: number): string {
  assertInteger(value)
  if (value < 0) {
    return 'mínusz ' + baseNum2text(-value)
  }
  if (value === 0) {
    return 'nulla'
  }

  const groupSuffix = ['', 'ezer', 'millió', 'milliárd']
  const ones = ['', 'egy', 'kettő', 'három', 'négy', 'öt', 'hat', 'hét', 'nyolc', 'kilenc']
  const onesB = { '1': '', '2': 'két' }
  const tens = [
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
  const tensB = { '1': 'tíz', '2': 'húsz' }

  // loop through the digits in reverse order
  const digits: Array<string> = value.toString().split('').reverse()
  const text = digits.reduce(
    // groupId: 0 - ones | 1 - thousands | 2 - millions
    // numText: string value of digits
    // digit: iterable = digits[digitId]
    ({ group: groupId, text: numText }, digit, digitId, digits) => {
      if (digitId % 3 == 0) {
        const upcomingDigits = digits.slice(digitId, Math.min(digits.length, digitId + 3))
        if (upcomingDigits.join() !== '0,0,0') {
          // only add hyphen for >2000 numbers
          if (value > 2000 && groupId > 0 && numText !== '') numText = `-${numText}`
          // only add group suffix if upcoming digits are not empty
          numText = groupSuffix[groupId] + numText
        }
        // remove "egy" from "egyezer"
        // replace "kettő" with "két" for thousands onwards
        const firstDigit = digitId === digits.length - 1
        const thousandsText =
          (digit in onesB && groupId === 1 && firstDigit) || (groupId > 0 && digit === '2')
            ? onesB[digit]
            : ones[digit]
        numText = thousandsText + numText
        groupId++
      } else if (digitId % 3 === 1) {
        const tensText = digits[digitId - 1] === '0' && digit in tensB ? tensB[digit] : tens[digit]
        numText = tensText + numText
      } else if (digitId % 3 === 2) {
        if (digit !== '0') {
          const hundredsText = digit in onesB ? onesB[digit] : ones[digit]
          numText = `${hundredsText}száz${numText}`
        }
      }
      return { group: groupId, text: numText }
    },
    { group: 0, text: '' },
  ).text

  return text
}

function num2text(num: PLNumber): PLString {
  let result = ''
  if (num instanceof PLNumber) {
    if (Number.isInteger(num.value)) {
      result = baseNum2text(num.value)
    }
  }
  return plString(result)
}

export const langUtils = {
  abbreviate,
  translate,
  ['article']: format(article),
  ['num-to-text']: num2text,
}
