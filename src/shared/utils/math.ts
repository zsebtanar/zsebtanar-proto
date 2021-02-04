export function randomInt(max = 10): number {
  return Math.floor(Math.random() * max)
}

export function floatEq(a: number, b: number): boolean {
  return a === b || (a >= b - Number.EPSILON && a <= b + Number.EPSILON)
}
