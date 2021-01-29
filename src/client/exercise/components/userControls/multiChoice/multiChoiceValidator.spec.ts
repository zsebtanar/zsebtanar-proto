import { multiChoiceValidation as multiChoice } from './multiChoiceValidator'
import { ExerciseSubTaskControlsType, UCMultiChoice } from 'shared/exercise/types'

describe('multiChoice', () => {
  const baseCtrl: UCMultiChoice = {
    type: ExerciseSubTaskControlsType.MultiChoice,
    name: 'test',
    isDynamic: false,
    props: { options: [], randomOrder: false },
    solution: [], // not used
  }
  it('should pass in the basic case', () => {
    expect(multiChoice(baseCtrl, [true], [true])).toBe(true)
    expect(multiChoice(baseCtrl, [false, true], [false, true])).toBe(true)
  })

  it('should fail if no solution', () => {
    ;[null, undefined, {}, []].map(input => {
      // @ts-expect-error
      expect(multiChoice(baseCtrl, input, input)).toBe(false)
    })
  })

  it('should fail if the user input empty', () => {
    ;[null, undefined, {}].map(input => {
      // @ts-expect-error
      expect(multiChoice(baseCtrl, [true], input)).toBe(false)
    })
  })
})
