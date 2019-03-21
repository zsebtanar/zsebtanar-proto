import { isNotZeroInteger } from '../math'

describe('isNotZeroInteger', () => {
  it('should return with true if the number is positive', () => {
    const testValues = [100, 1]
    const actual = testValues.map(isNotZeroInteger)
    expect(actual.every(v => v === true)).toBeTruthy()
  })

  it('should return with false if the number is 0 or less', () => {
    const testValues = [-100, -1, -0, 0]
    const actual = testValues.map(isNotZeroInteger)
    expect(actual.every(v => v === false)).toBeTruthy()
  })

  it('should return with false if the number is not integer', () => {
    const testValues = [0.1, 100.1]
    const actual = testValues.map(isNotZeroInteger)
    expect(actual.every(v => v === false)).toBeTruthy()
  })

  it('should return with false if parameter is not a valid number', () => {
    const testValues = [Infinity, -Infinity, NaN, 'string', {}]
    const actual = testValues.map(isNotZeroInteger)
    expect(actual.every(v => v === false)).toBeTruthy()
  })
})
