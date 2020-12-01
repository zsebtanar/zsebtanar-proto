import { floatEq, listDivisors } from './math'

test('floatEq', () => {
  expect(floatEq(2, 3)).toBe(false)
  expect(floatEq(3, 3)).toBe(true)
  expect(floatEq(0.1 + 0.2, 0.3)).toBe(true)
  expect(floatEq(1 + Number.EPSILON, 1)).toBe(true)
  expect(floatEq(1 + Number.EPSILON * 2, 1)).toBe(false)
  expect(floatEq(NaN, 1)).toBe(false)
  expect(floatEq(NaN, NaN)).toBe(false)
})

test('listDivisors', () => {
  expect(() => {listDivisors(0)}).toThrow('Number out of range (< 1)')
  expect(() => {listDivisors(1000001)}).toThrow('Number too large')
  expect(listDivisors(1)).toStrictEqual([1])
  expect(listDivisors(2)).toStrictEqual([1, 2])
  expect(listDivisors(4)).toStrictEqual([1, 2, 4])
  expect(listDivisors(6)).toStrictEqual([1, 2, 3, 6])
  expect(listDivisors(12)).toStrictEqual([1, 2, 3, 4, 6, 12])
})
