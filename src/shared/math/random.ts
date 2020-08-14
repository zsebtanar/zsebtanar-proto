// https://en.wikipedia.org/wiki/Linear_congruential_generator
// x_n+1 = (aX_n + c) mod m

const m = 2 ** 31
const a = 1103515245
const c = 12345

export class PseudoRandomNumberGenerator {
  private readonly seed: number
  private nextSeed: number

  constructor(seed?: number) {
    if (seed === undefined) {
      seed = Math.round(Math.random() * 10 ** 6)
    }
    if (!(Number.isInteger(seed) && seed > 0)) {
      throw new Error('Seed must be a positive integer number')
    }
    this.seed = seed
    this.nextSeed = seed
  }

  private next() {
    return (this.nextSeed = (a * this.nextSeed + c) % m)
  }

  public get baseSeed(): number {
    return this.seed
  }

  public randomInt(num = 10): number {
    const next = this.next()
    console.log('rand', num, next, (next - 1) % num)
    return (next - 1) % num
  }

  public randomFloat(): number {
    return this.randomInt(m) / m
  }
}
