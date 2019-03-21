import { singleNumber } from 'server/exercise/validate/userControls/singleNumber'

describe('singleNumber', () => {
  it('should pass in the simplest case', () => {
    expect(singleNumber(null, 'A', 'A')).toBe(true)
  })

  it('should fail in any other case', () => {
    ;[null, undefined, 'a', 1].map(input => expect(singleNumber(null, 'A', input)).toBe(false))
  })
})
