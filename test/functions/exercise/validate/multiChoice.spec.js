import { binaryChoiceCheck as multiChoice } from '../../../../functions/src/exercise/validate/userControls/multiChoice'

describe('multiChoice', () => {
  it('should pass in the basic case', () => {
    expect(multiChoice(null, { idA: true }, { idA: true })).toBe(true)
    expect(multiChoice(null, { idA: false, idB: true }, { idA: false, idB: true })).toBe(true)
  })

  it('should fail if no solution', () => {
    ;[null, undefined, {}, []].map(input => expect(multiChoice(null, input, input)).toBe(false))
  })

  it('should fail if the user input empty', () => {
    ;[null, undefined, {}].map(input => expect(multiChoice(null, { idA: true }, input)).toBe(false))
  })
})
