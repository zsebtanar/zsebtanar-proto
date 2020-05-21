import { multiChoiceCheck as multiChoice } from './multiChoice'

describe('multiChoice', () => {
  it('should pass in the basic case', () => {
    expect(multiChoice(null as any, [true], [true])).toBe(true)
    expect(multiChoice(null as any, [false, true], [false, true])).toBe(true)
  })

  it('should fail if no solution', () => {
    ;[null, undefined, {}, []].map(input =>
      expect(multiChoice(null as any, input as any, input as any)).toBe(false)
    )
  })

  it('should fail if the user input empty', () => {
    ;[null, undefined, {}].map(input =>
      expect(multiChoice(null as any, [true], input as any)).toBe(false)
    )
  })
})
