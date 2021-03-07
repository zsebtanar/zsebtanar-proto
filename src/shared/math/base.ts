export function isNotZeroInteger(x: number): boolean {
  return Number.isInteger(x) && x > 0
}

export function toPrecision(num: string, p = 0): number {
  const x = 10 ** p
  return Math.round(parseFloat(num) * x) / x
}
