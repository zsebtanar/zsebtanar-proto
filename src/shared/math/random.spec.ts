import { PseudoRandomNumberGenerator } from './random'

describe('pseudo random generator', () => {
  it('init should fail for none positive integers', () => {
    expect(() => new PseudoRandomNumberGenerator(-10)).toThrow(
      'Seed must be a positive integer number',
    )
    expect(() => new PseudoRandomNumberGenerator(0)).toThrow(
      'Seed must be a positive integer number',
    )
    expect(() => new PseudoRandomNumberGenerator(0.1)).toThrow(
      'Seed must be a positive integer number',
    )
  })

  it('should work', () => {
    const prng = new PseudoRandomNumberGenerator(10)
    expect(prng.baseSeed).toEqual(10)
  })

  it('should generate different result for different seed', () => {
    expect(new PseudoRandomNumberGenerator(10).randomInt()).not.toEqual(
      new PseudoRandomNumberGenerator(11).randomInt(),
    )
  })

  it('should generate the same result for the same seed', () => {
    expect(new PseudoRandomNumberGenerator(10).randomInt()).toEqual(
      new PseudoRandomNumberGenerator(10).randomInt(),
    )
  })

  it('should generate new value for upcoming item', () => {
    const prng = new PseudoRandomNumberGenerator(10)
    expect(prng.randomInt()).not.toEqual(prng.randomInt())
  })

  describe('randomInt', () => {
    it('should evenly distribute with maximum 5% difference in long run', () => {
      const prng = new PseudoRandomNumberGenerator()
      const res = [] as number[]

      function checkDistribution(range: number) {
        const runCount = 10000
        const sampleSize = runCount * range
        const frequency = 1 / range
        const tolerance = 0.05
        for (let i = 0; i < sampleSize; i++) {
          const y = prng.randomInt(range)
          res[y] = (res[y] ?? 0) + 1
        }

        expect(res.length).toEqual(range)
        for (let i = 0; i < res.length; i++) {
          res[i] = (res[i] ?? 0) / sampleSize
        }
        console.log(res)

        expect(res.every((x) => frequency - tolerance < x && x < frequency + tolerance)).toEqual(
          true,
        )
      }

      checkDistribution(2)
      checkDistribution(3)
      checkDistribution(4)
      checkDistribution(5)
      checkDistribution(6)
      checkDistribution(7)
      checkDistribution(8)
      checkDistribution(9)
      checkDistribution(10)
    })
  })
})
