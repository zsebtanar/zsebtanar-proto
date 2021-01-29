import { floatEq } from './math'

test('floatEq', () => {
  expect(floatEq(2, 3)).toBe(false)
  expect(floatEq(3, 3)).toBe(true)
  expect(floatEq(0.1 + 0.2, 0.3)).toBe(true)
  expect(floatEq(1 + Number.EPSILON, 1)).toBe(true)
  expect(floatEq(1 + Number.EPSILON * 2, 1)).toBe(false)
  expect(floatEq(NaN, 1)).toBe(false)
  expect(floatEq(NaN, NaN)).toBe(false)
})
