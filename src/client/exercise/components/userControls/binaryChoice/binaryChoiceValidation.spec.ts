import { binaryChoiceValidation } from './binaryChoiceValidation'
import { ExerciseSubTaskControlsType, UCBinaryChoice } from 'shared/exercise/types'

describe('binaryChoice', () => {
  const baseCtrl: UCBinaryChoice = {
    type: ExerciseSubTaskControlsType.BinaryChoice,
    name: 'test',
    isDynamic: false,
    props: {
      randomOrder: false,
      options: [],
    },
    solution: [], // not used
  }
  it('should pass in the basic case', () => {
    expect(binaryChoiceValidation(baseCtrl, [true], [true])).toBe(true)
    expect(binaryChoiceValidation(baseCtrl, [false, true], [false, true])).toBe(true)
    // @ts-expect-error
    expect(binaryChoiceValidation(baseCtrl, [false, true], ['false', 'true'])).toBe(false)
  })

  it('should fail if no solution', () => {
    ;[null, undefined, {}, []].map(input =>
      // @ts-expect-error
      expect(binaryChoiceValidation(baseCtrl, input, input)).toBe(false),
    )
  })

  it('should fail if the user input empty', () => {
    ;[baseCtrl, undefined, {}].map(input =>
      // @ts-expect-error
      expect(binaryChoiceValidation(baseCtrl, [true], input)).toBe(false),
    )
  })
})
