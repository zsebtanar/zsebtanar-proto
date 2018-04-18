export function fractionNum(numerator, denominator) {
  return { numerator: parseInt(numerator, 10), denominator: parseInt(denominator, 10) }
}

/**
 * Greatest common divisor
 * Euclid's algorithm
 *
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */
export function gcd(a, b) {
  return a === b || !a || !b ? a : gcd(b, a % b)
}

export function simplifyFractionNumber({ numerator, denominator }) {
  if (numerator == null || denominator == null) return NaN

  const divisor = gcd(parseInt(numerator), parseInt(denominator))
  return fractionNum(numerator / divisor, denominator / divisor)
}
