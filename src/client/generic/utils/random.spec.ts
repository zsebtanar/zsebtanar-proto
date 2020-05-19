import { PseudoRandomNumberGenerator } from './random'

describe('pseudo random generator', () => {
  it('init should fail for none positive integers', () => {
    expect(() => new PseudoRandomNumberGenerator(-10)).toThrow(
      'Seed must be a positive integer number'
    )
    expect(() => new PseudoRandomNumberGenerator(0)).toThrow(
      'Seed must be a positive integer number'
    )
    expect(() => new PseudoRandomNumberGenerator(0.1)).toThrow(
      'Seed must be a positive integer number'
    )
  })
  it('should work', () => {
    const prng = new PseudoRandomNumberGenerator(10)
    expect(prng.baseSeed).toEqual(10)
  })
  it('should generate different result for different seed', () => {
    expect(new PseudoRandomNumberGenerator(10).randomInt()).not.toEqual(
      new PseudoRandomNumberGenerator(11).randomInt()
    )
  })
  it('should generate the same result for the same seed', () => {
    expect(new PseudoRandomNumberGenerator(10).randomInt()).toEqual(
      new PseudoRandomNumberGenerator(10).randomInt()
    )
  })
  it('should generate new value for upcoming item', () => {
    const prng = new PseudoRandomNumberGenerator(10)
    expect(prng.randomInt()).not.toEqual(prng.randomInt())
  })
})
