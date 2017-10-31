import { binaryChoiceCheck as binaryChoice } from '../../../../functions/src/exercise/validate/userControls/binaryChoice'

describe('binaryChoice', () => {
  it('should pass in the basic case', () => {
    expect(binaryChoice(null, { idA: true }, { idA: true })).toBe(true)
    expect(binaryChoice(null, { idA: false, idB: true }, { idA: false, idB: true })).toBe(true)
    expect(binaryChoice(null, { idA: false, idB: true }, { idA: 'false', idB: 'true' })).toBe(true)
  })

  it('should fail if no solution', () => {
    ;[null, undefined, {}, []].map(input => expect(binaryChoice(null, input, input)).toBe(false))
  })

  it('should fail if the user input empty', () => {
    ;[null, undefined, {}].map(input =>
      expect(binaryChoice(null, { idA: true }, input)).toBe(false)
    )
  })
})
