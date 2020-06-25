import { fractionNumberValidation } from './fractionNumberValidation'
import { fractionNum } from 'shared/math/fractionNumber'
import { ExerciseSubTaskControlsType, UCFractionNumber } from 'shared/exercise/types'

// eslint-disable @typescript-eslint/no-explicit-any
describe('fractionNumber', () => {
  const baseCtrl: UCFractionNumber = {
    type: ExerciseSubTaskControlsType.FractionNumber,
    name: 'test',
    isDynamic: false,
    props: {},
    solution: fractionNum(1, 1), // not used
  }

  it('should pass in the simplest case', () => {
    expect(fractionNumberValidation(baseCtrl, fractionNum(1, 1), fractionNum(1, 1))).toBe(true)
  })

  it('should pass if inputs need simplification', () => {
    expect(fractionNumberValidation(baseCtrl, fractionNum(1, 3), fractionNum(3, 9))).toBe(true)
  })

  it('should pass if the input is string', () => {
    const f1 = fractionNum('3', '9')
    const f2 = fractionNum('6', '18')
    const f3 = fractionNum(6, 18)
    expect(fractionNumberValidation(baseCtrl, f1, f2)).toBe(true)
    expect(fractionNumberValidation(baseCtrl, f1, f3)).toBe(true)
  })

  it('should fail if the input is not valid', () => {
    const f1 = fractionNum(3, 9)
    // @ts-expect-error
    expect(fractionNumberValidation(baseCtrl, f1, { n: 1, d: 3 })).toBe(false)
    // @ts-expect-error
    expect(fractionNumberValidation(baseCtrl, f1, {})).toBe(false)
    // @ts-expect-error
    expect(fractionNumberValidation(baseCtrl, f1, 10)).toBe(false)
    // @ts-expect-error
    expect(fractionNumberValidation(baseCtrl, f1, undefined)).toBe(false)
    // @ts-expect-error
    expect(fractionNumberValidation(baseCtrl, f1, NaN)).toBe(false)
  })
})
// eslint-enable
