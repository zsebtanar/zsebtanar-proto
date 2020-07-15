export function intersection<T>(a: T[], b: T[]): T[] {
  const as = new Set(a)
  const bs = new Set(b)

  return Array.from(new Set<T>(Array.from(as).filter((i) => bs.has(i))))
}

export function difference<T>(a: T[], b: T[]): T[] {
  const as = new Set(a)
  const bs = new Set(b)

  return Array.from(new Set<T>(Array.from(as).filter((i) => !bs.has(i))))
}
