import { intersection, difference } from './data'

describe('data', () => {
  describe('intersection', () => {
    it('should work', () => {
      expect(intersection([], [])).toEqual([])
      expect(intersection([1, 2, 3], [])).toEqual([])
      expect(intersection([], [1, 2, 3])).toEqual([])
      expect(intersection([1, 2, 3], [4, 5, 6])).toEqual([])
      expect(intersection([1, 2, 3], [3, 4, 5, 6])).toEqual([3])
      expect(intersection([1, 2, 3], [1, 2, 3])).toEqual([1, 2, 3])
    })
  })

  describe('difference', () => {
    it('should work', () => {
      expect(difference([], [])).toEqual([])
      expect(difference([1, 2, 3], [])).toEqual([1, 2, 3])
      expect(difference([], [1, 2, 3])).toEqual([])
      expect(difference([1, 2, 3], [4, 5, 6])).toEqual([1, 2, 3])
      expect(difference([1, 2, 3], [3, 4, 5, 6])).toEqual([1, 2])
      expect(difference([1, 2, 3], [1, 2, 3])).toEqual([])
    })
  })
})
