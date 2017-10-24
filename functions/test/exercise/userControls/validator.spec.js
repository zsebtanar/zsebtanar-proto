import validator from '../../../../functions/src/exercise/userControls/validator'

describe('validator', () => {
  it('should return empty array if no user input in the exercise', () => {
    ;[null, undefined, {}, []].map(input => expect(validator({}, { solutions: input })).toEqual([]))
  })

  it('should return invalid solution(s) if no solution from the user', () => {
    ;[null, undefined, {}, []].map(input =>
      expect(
        validator(input, {
          solutions: { idA: 'solution' },
          controls: { idA: { controlType: 'simple-text' } }
        })
      ).toEqual([false])
    )
  })

  it('should return invalid solution(s) if the input type is not defined', () => {
    expect(
      validator(
        { idA: 'solution' },
        {
          solutions: { idA: 'solution' },
          controls: { idA: { controlType: 'unknown' } }
        }
      )
    ).toEqual([false])
  })

  it('should return valid solution(s) if the user send valid solution', () => {
    expect(
      validator(
        { idA: { a: true, b: false } },
        {
          solutions: { idA: { a: 'true', b: 'false' } },
          controls: { idA: { controlType: 'binary-choice' } }
        }
      )
    ).toEqual([true])
  })
})
