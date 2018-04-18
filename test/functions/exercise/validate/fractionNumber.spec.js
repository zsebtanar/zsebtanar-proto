import { fractionNumber } from '../../../../functions/src/exercise/validate/userControls/fractionNumber'
import { fractionNum } from '../../../../functions/src/utils/math'

describe('fractionNumber', () => {
  it('should pass in the simplest case', () => {
    expect(fractionNumber(null, fractionNum(1, 1), fractionNum(1, 1))).toBe(true)
  })

  it('should pass if inputs need simplification', () => {
    expect(fractionNumber(null, fractionNum(1, 3), fractionNum(3, 9))).toBe(true)
  })

  it('should pass if the input is string', () => {
    const f1 = fractionNum('3', '9')
    const f2 = fractionNum('6', '18')
    const f3 = fractionNum(6, 18)
    expect(fractionNumber(null, f1, f2)).toBe(true)
    expect(fractionNumber(null, f1, f3)).toBe(true)
  })

  it('should fail if the input is not valid', () => {
    const f1 = fractionNum(3, 9)
    expect(fractionNumber(null, f1, { n: 1, d: 3 })).toBe(false)
    expect(fractionNumber(null, f1, {})).toBe(false)
    expect(fractionNumber(null, f1, 10)).toBe(false)
    expect(fractionNumber(null, f1, undefined)).toBe(false)
    expect(fractionNumber(null, f1, NaN)).toBe(false)
  })
})
