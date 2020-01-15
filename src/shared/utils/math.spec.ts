import { isNotZeroInteger } from './math'

test('isNotZeroInteger results', () => {
  expect(isNotZeroInteger(-Infinity)).toBe(false)
  expect(isNotZeroInteger(-42)).toBe(false)
  expect(isNotZeroInteger(-0)).toBe(false)
  expect(isNotZeroInteger(0)).toBe(false)
  expect(isNotZeroInteger(1)).toBe(true)
  expect(isNotZeroInteger(42)).toBe(true)
  expect(isNotZeroInteger(Infinity)).toBe(false)
})
