import { log, noop, toAbcIndex, clamp, range, sortByProp, omit, list2map } from './fn'

describe('utility fn', () => {
  describe('log', () => {
    it('should console log all attributes and return with the first one', () => {
      const cl = jest.spyOn(console, 'log').mockImplementation(noop)
      expect(log(1, 2, 3)).toEqual(1)

      expect(cl).toBeCalledTimes(1)
      expect(cl).toBeCalledWith(1, 2, 3)

      cl.mockRestore()
    })
  })

  describe('clamp', () => {
    it('should clmap value', () => {
      expect(clamp(0, 10, -Infinity)).toEqual(0)
      expect(clamp(0, 10, -1)).toEqual(0)
      expect(clamp(0, 10, 0)).toEqual(0)
      expect(clamp(0, 10, 5)).toEqual(5)
      expect(clamp(0, 10, 10)).toEqual(10)
      expect(clamp(0, 10, 11)).toEqual(10)
      expect(clamp(0, 10, Infinity)).toEqual(10)
      expect(clamp(0, 10, NaN)).toEqual(NaN)
    })
  })

  describe('toAbcIndex', () => {
    it('should return with alphanumerical index', () => {
      expect(toAbcIndex(-1)).toEqual('a')
      expect(toAbcIndex(0)).toEqual('a')
      expect(toAbcIndex(25)).toEqual('z')
      expect(toAbcIndex(26)).toEqual('z')
    })
  })

  describe('range', () => {
    it('should generate a range of integers', () => {
      expect(range(0, 3)).toEqual([0, 1, 2])
      expect(range(0, 3, 1)).toEqual([0, 1, 2])
      expect(range(3, 0, 1)).toEqual([])
    })
  })

  describe('sortByProp', () => {
    it('should sort array based on a specific item property', () => {
      const base = [{ a: 2 }, { a: 3 }, { a: 1 }]
      const result = [{ a: 1 }, { a: 2 }, { a: 3 }]
      expect(base.sort(sortByProp('a'))).toEqual(result)
    })
  })

  describe('omit', () => {
    it('should omit the specified props form the source object', () => {
      const base = { a: 1, b: 2, c: 3 }
      const result = omit(base, ['b'])

      expect(base).not.toEqual(result)
      expect(result).toEqual({ a: 1, c: 3 })
    })
  })

  describe('list2map', () => {
    it('should handle empty list', () => {
      expect(list2map('', [])).toEqual({})
    })

    it('should handle invalid props', () => {
      expect(
        list2map('idd', [
          { id: 'a', value: 1 },
          { id: 'b', value: 2 },
        ]),
      ).toEqual({})
    })

    it('should handle invalid props', () => {
      expect(
        list2map('id', [
          { id: 'a', value: 1 },
          { id: 'b', value: 2 },
        ]),
      ).toEqual({
        a: { id: 'a', value: 1 },
        b: { id: 'b', value: 2 },
      })
    })
  })
})
