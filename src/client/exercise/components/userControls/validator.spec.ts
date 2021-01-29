import { userControlValidator as validator } from 'client/exercise/components/userControls/validator'
import { ExerciseSubTaskControlsType } from 'shared/exercise/types'

describe('validator', () => {
  it('should return empty object if no user input in the exercise', () => {
    const interpreter = jest.fn()
    ;[null, undefined, {}, []].map(input =>
      // @ts-expect-error
      expect(validator({}, { solutions: input }, interpreter)).toEqual([]),
    )
  })

  it('should return invalid solution(s) if no solution from the user', () => {
    const interpreter = jest.fn()

    ;[null, undefined, {}, []].map(input =>
      expect(
        validator(
          // @ts-expect-error
          input,
          {
            solutions: { idA: 'solution' },
            controls: { idA: { controlType: 'simple-text' } },
          },
          interpreter,
        ),
      ).toEqual([]),
    )
  })

  it('should return invalid solution(s) if the input type is not defined', () => {
    const interpreter = jest.fn()
    // @ts-expect-error
    expect(validator(['solution'], { controls: [{ type: 'unknown' }] }, interpreter)).toEqual([
      false,
    ])
  })

  it('should return valid solution(s) if the user send valid solution', () => {
    const interpreter = jest.fn()

    expect(
      validator(
        [[true, false]],
        {
          hints: [],
          description: '',
          title: '',
          controls: [
            {
              type: ExerciseSubTaskControlsType.BinaryChoice,
              isDynamic: false,
              name: '',
              props: {
                randomOrder: false,
                options: [] as any,
              },
              solution: [true, false],
            },
          ],
        },
        interpreter,
      ),
    ).toEqual([true])
  })
})
