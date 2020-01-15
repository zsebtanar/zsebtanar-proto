import { singleChoice } from '../singleChoice'

describe('singleChoice', () => {
  it('should pass in the simplest case', () => {
    expect(singleChoice(null as any, 'A', 'A')).toBe(true)
  })

  it('should fail in any other case', () => {
    ;[null, undefined, 'a', 1].map(input =>
      expect(singleChoice(null as any, 'A', input as any)).toBe(false)
    )
  })
})
