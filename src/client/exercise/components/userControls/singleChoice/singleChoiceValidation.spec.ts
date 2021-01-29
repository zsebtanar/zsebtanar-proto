import { singleChoiceValidation } from './singleChoiceValidation'
import { ExerciseSubTaskControlsType, UCSingleChoice } from 'shared/exercise/types'

describe('singleChoice', () => {
  const baseCtrl: UCSingleChoice = {
    type: ExerciseSubTaskControlsType.SingleChoice,
    name: 'test',
    isDynamic: false,
    props: {
      options: [],
    },
    solution: NaN, // not used
  }
  it('should pass in the simplest case', () => {
    expect(singleChoiceValidation(baseCtrl, 42, 42)).toBe(true)
  })

  it('should fail in any other case', () => {
    ;[null, undefined, 'a', 1].map(input =>
      // @ts-expect-error
      expect(singleChoiceValidation(baseCtrl, 10, input)).toBe(false),
    )
  })
})
