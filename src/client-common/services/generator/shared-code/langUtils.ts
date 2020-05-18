import { PLNumber, PLFractionNumber } from 'pocket-lisp-stdlib'
import { assertInteger, typeCheck } from './utils'

export const suffixTimes = (num: number) => {
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
export const suffixTimes2 = (num: number) => {
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
const baseSuffixFraction = (num: number) => {
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

function suffixFloat(num: PLNumber) {
  typeCheck(PLNumber, num)

  const floatPart = parseInt(num.value.toString().split('.')[1] || '0')

  if (floatPart > 0) {
    return baseSuffixFraction(floatPart)
  } else {
    return ''
  }
}

function suffixFraction(num: PLFractionNumber) {
  typeCheck(PLFractionNumber, num)
  assertInteger(num.denominator)

  return baseSuffixFraction(num.denominator)
}

/**
 * Add article to number
 *
 *
 * @param capital
 * @param value
 * @param capital
 */
function article(value: number, capital = false): string {
  const text = num2text(value)
  return /^[aáeéiíoóöőuúüű]/.test(text) ? 'az' : 'a'
}

/**
 * Write down number with letters
 *
 *
 * @return string $num_text Number with text
 * @param value
 */
function num2text(value: number) {
  assertInteger(value)
  const absNum = Math.abs(value)
  const digits = absNum
    .toString()
    .split('')
    .reverse()

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
    'kilencven'
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
    'kilencven'
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
    { group: 0, text: '' }
  ).text

  return text
    .replace('egyezer', 'ezer')
    .replace('kettőezer', 'kétezer')
    .replace('kettőmillió', 'kétmillió')
    .replace('kettőmilliárd', 'kétmilliárd')
}

/**
 * Add suffix dativus to number (at/et/öt/t)
 *
 *
 * @return string $suffix Suffix
 * @param value
 */
const dativus = (value: number) => {
  const absNum = Math.abs(value)

  switch (absNum % 10) {
    case 1:
    case 4:
    case 7:
    case 9:
      return 'et'
    case 2:
      return 't'
    case 3:
    case 8:
      return 'at'
    case 5:
      return 'öt'
    case 6:
      return 'ot'
  }

  switch ((absNum / 10) % 10) {
    case 1:
    case 4:
    case 5:
    case 7:
    case 9:
      return 'et'
    case 2:
    case 3:
    case 6:
    case 8:
      return 'at'
  }

  if (absNum == 0) {
    return 't'
  } else if (100 <= absNum && absNum < 1000) {
    return 'at'
  } else if (1000 <= absNum && absNum < 1000000) {
    return 'et'
  } else {
    return 't'
  }
}

export const listJoinLocal = (list, lastSrt = 'vagy') => {
  if (list.length < 2) {
    return list.toString()
  }
  const last = list.pop()
  return `${list.join(', ')} ${lastSrt} ${last}`
}

function numberFormatter(num: PLNumber | PLFractionNumber, format: string[]): string {
  if (num instanceof PLNumber) {
    return article(num.value) + dativus(num.value)
  } else {
    return ''
  }
}

export const langUtils = {
  ['suffix-times']: suffixTimes,
  ['suffix-times2']: suffixTimes2,
  ['suffix-float']: suffixFloat,
  ['suffix-fraction']: suffixFraction,
  ['num-fmt']: numberFormatter
}
;`




/**
 * Write order of number
 *
 * @param int $num Number (<=10!)
 *
 * @return string $text Order (text)
 */
function OrderText($num) { 
  $text_array = array(
    0 => 'nulladik',
    1 => 'első',
    2 => 'második',
    3 => 'harmadik',
    4 => 'negyedik',
    5 => 'ötödik',
    6 => 'hatodik',
    7 => 'hetedik',
    8 => 'nyolcadik',
    9 => 'kilencedik',
    10 => 'tizedik'
  );

  $text = $text_array[$num];

  return $text;
}

/**
 * Format big numbers
 *
 * @param int $num Number
 *
 * @return string $num2 Number (formatted)
 */
function BigNum($num) { 
  if ($num < 10000) {
    $num2 = $num;
  } else {
    if (is_integer($num)) {
      $num2 = number_format($num, 0, ',', '\\,');
    } else {
      $digits = strlen(substr(strrchr($num, "."), 1));
      $num2 = number_format($num, $digits, ',', '\\,');
    }
  }

  return $num2;
}


`
