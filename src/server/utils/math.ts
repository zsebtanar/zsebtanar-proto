export const INVALID_FRACTION_NUMBER: FractionNumber = { numerator: NaN, denominator: NaN }

export function fractionNum(
  numerator: number | string,
  denominator: number | string
): FractionNumber {
  const a = typeof numerator === 'string' ? parseInt(numerator, 10) : numerator
  const b = typeof denominator === 'string' ? parseInt(denominator, 10) : denominator

  return isNaN(a) || isNaN(b) ? INVALID_FRACTION_NUMBER : { numerator: a, denominator: b }
}

/**
 * Greatest common divisor
 * Euclid's algorithm
 *
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */
export function gcd(a: number, b: number) {
  return a === b || !a || !b ? a : gcd(b, a % b)
}

export function simplifyFractionNumber(fractionNumber: FractionNumber) {
  if (!isValid(fractionNumber)) return fractionNumber
  const { numerator, denominator } = fractionNumber

  const divisor = gcd(numerator, denominator)
  return fractionNum(numerator / divisor, denominator / divisor)
}

export function isValid({ numerator, denominator }: FractionNumber) {
  return !(isNaN(numerator) || isNaN(denominator))
}
