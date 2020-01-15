import { singleNumber } from '../singleNumber'

describe('singleNumber', () => {
  it('should pass in the simplest case', () => {
    expect(singleNumber(null as any, 'A' as any, 'A' as any)).toBe(true)
  })

  it('should fail in any other case', () => {
    ;[null, undefined, 'a', 1].map(input =>
      expect(singleNumber(null as any, 'A' as any, input as any)).toBe(false)
    )
  })
})
