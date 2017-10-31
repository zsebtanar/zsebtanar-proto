import { singleChoice } from '../../../../functions/src/exercise/validate/userControls/singleChoice'

describe('singleChoice', () => {
  it('should pass in the simplest case', () => {
    expect(singleChoice(null, 'A', 'A')).toBe(true)
  })

  it('should fail in any other case', () => {
    ;[null, undefined, 'a', 1].map(input => expect(singleChoice(null, 'A', input)).toBe(false))
  })
})
