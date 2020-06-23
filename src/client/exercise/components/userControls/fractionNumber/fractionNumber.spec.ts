import { fractionNumber } from './fractionNumber'
import { fractionNum } from 'shared/math/fractionNumber'

// eslint-disable @typescript-eslint/no-explicit-any
describe('fractionNumber', () => {
  it('should pass in the simplest case', () => {
    expect(fractionNumber(null as any, fractionNum(1, 1), fractionNum(1, 1))).toBe(true)
  })

  it('should pass if inputs need simplification', () => {
    expect(fractionNumber(null as any, fractionNum(1, 3), fractionNum(3, 9))).toBe(true)
  })

  it('should pass if the input is string', () => {
    const f1 = fractionNum('3', '9')
    const f2 = fractionNum('6', '18')
    const f3 = fractionNum(6, 18)
    expect(fractionNumber(null as any, f1, f2)).toBe(true)
    expect(fractionNumber(null as any, f1, f3)).toBe(true)
  })

  it('should fail if the input is not valid', () => {
    const f1 = fractionNum(3, 9)
    expect(fractionNumber(null as any, f1, { n: 1, d: 3 } as any)).toBe(false)
    expect(fractionNumber(null as any, f1, {} as any)).toBe(false)
    expect(fractionNumber(null as any, f1, 10 as any)).toBe(false)
    expect(fractionNumber(null as any, f1, undefined as any)).toBe(false)
    expect(fractionNumber(null as any, f1, NaN as any)).toBe(false)
  })
})
// eslint-enable
