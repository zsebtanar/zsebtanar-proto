import { binaryChoiceCheck as binaryChoice } from './binaryChoice'

describe('binaryChoice', () => {
  it('should pass in the basic case', () => {
    // @ts-expect-error
    expect(binaryChoice(null, { idA: true }, { idA: true })).toBe(true)
    // @ts-expect-error
    expect(binaryChoice(null, { idA: false, idB: true }, { idA: false, idB: true })).toBe(true)
    expect(
      // @ts-expect-error
      binaryChoice(null, { idA: false, idB: true }, { idA: 'false', idB: 'true' } as any)
    ).toBe(true)
  })

  it('should fail if no solution', () => {
    // @ts-expect-error
    ;[null, undefined, {}, []].map(input => expect(binaryChoice(null, input, input)).toBe(false))
  })

  it('should fail if the user input empty', () => {
    ;[null, undefined, {}].map(input =>
      // @ts-expect-error
      expect(binaryChoice(null, { idA: true }, input)).toBe(false)
    )
  })
})
