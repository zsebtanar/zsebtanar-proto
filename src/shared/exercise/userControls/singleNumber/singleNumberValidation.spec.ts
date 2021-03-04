import { singleNumberValidation } from './singleNumberValidation'
import { UCSingleNumber, ExerciseSubTaskControlsType } from 'shared/exercise/types'

describe('singleNumber', () => {
  const baseCtrl: UCSingleNumber = {
    type: ExerciseSubTaskControlsType.SingleNumber,
    name: 'test',
    isDynamic: false,
    props: {
      fractionDigits: 1,
    },
    solution: '', // not used
  }
  it('should handle all kind of user input', () => {
    const interpreter = jest.fn()

    // @ts-expect-error
    expect(singleNumberValidation(baseCtrl, undefined, interpreter)).toBe(false)
    // @ts-expect-error
    expect(singleNumberValidation(baseCtrl, null, interpreter)).toBe(false)
    // @ts-expect-error
    expect(singleNumberValidation(baseCtrl, NaN, '10.3')).toBe(false)
    expect(singleNumberValidation(baseCtrl, 'A', '10.3')).toBe(false)
    expect(singleNumberValidation(baseCtrl, '10', '10.3')).toBe(false)
    expect(singleNumberValidation(baseCtrl, '10.3', '10.3')).toBe(true)
    expect(singleNumberValidation(baseCtrl, '10.31', '10.3')).toBe(true)
    expect(singleNumberValidation(baseCtrl, '10.35', '10.3')).toBe(false)

    expect(interpreter).toBeCalledTimes(0)
  })
})
