export function fractionNum(numerator, denominator) {
  return { numerator, denominator }
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

  const divisor = gcd(numerator, denominator)
  return fractionNum(numerator / divisor, denominator / divisor)
}
