import { singleNumberValidation } from './singleNumberValidation'
import { UCSingleNumber, ExerciseSubTaskControlsType } from 'shared/exercise/types'

describe('singleNumber', () => {
  describe('static', () => {
    const baseCtrl: UCSingleNumber = {
      type: ExerciseSubTaskControlsType.SingleNumber,
      name: 'test',
      isDynamic: false,
      props: {
        fractionDigits: 1,
      },
      solution: '10.3',
    }
    it('should handle all kind of user input', () => {
      const interpreter = jest.fn()

      // @ts-expect-error
      expect(singleNumberValidation(baseCtrl, undefined, interpreter)).toBe(false)
      // @ts-expect-error
      expect(singleNumberValidation(baseCtrl, null, interpreter)).toBe(false)
      // @ts-expect-error
      expect(singleNumberValidation(baseCtrl, NaN, interpreter)).toBe(false)
      expect(singleNumberValidation(baseCtrl, 'A', interpreter)).toBe(false)
      expect(singleNumberValidation(baseCtrl, '10', interpreter)).toBe(false)
      expect(singleNumberValidation(baseCtrl, '10.3', interpreter)).toBe(true)
      expect(singleNumberValidation(baseCtrl, '10.31', interpreter)).toBe(true)
      expect(singleNumberValidation(baseCtrl, '10.35', interpreter)).toBe(false)

      expect(interpreter).toBeCalledTimes(0)
    })
  })

  describe('dynamic', () => {
    const baseCtrl: UCSingleNumber = {
      type: ExerciseSubTaskControlsType.SingleNumber,
      name: 'test',
      isDynamic: true,
      props: {
        fractionDigits: 1,
      },
      solution: '',
    }
    it('should handle all kind of user input', () => {
      const interpreter = jest.fn().mockImplementation(() => '10.3')

      // @ts-expect-error
      expect(singleNumberValidation(baseCtrl, undefined, interpreter)).toBe(false)
      // @ts-expect-error
      expect(singleNumberValidation(baseCtrl, null, interpreter)).toBe(false)
      // @ts-expect-error
      expect(singleNumberValidation(baseCtrl, NaN, interpreter)).toBe(false)
      expect(singleNumberValidation(baseCtrl, 'A', interpreter)).toBe(false)
      expect(singleNumberValidation(baseCtrl, '10', interpreter)).toBe(false)
      expect(singleNumberValidation(baseCtrl, '10.3', interpreter)).toBe(true)
      expect(singleNumberValidation(baseCtrl, '10.31', interpreter)).toBe(true)
      expect(singleNumberValidation(baseCtrl, '10.35', interpreter)).toBe(false)

      expect(interpreter).toBeCalledTimes(8)
      expect(interpreter).toBeCalledWith('(solution-test)')
    })
  })
})
