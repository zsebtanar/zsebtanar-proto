import {
  fractionNum,
  INVALID_FRACTION_NUMBER,
  isValid,
  simplifyFractionNumber,
} from './fractionNumber'

describe('math', () => {
  describe('Fraction number', () => {
    describe('isValid', () => {
      it('should return with true if the parameter is a valid fraction number', () => {
        const values = [
          { numerator: 1, denominator: 1 },
          { numerator: -1, denominator: 1 },
          { numerator: 1, denominator: 3 },
          { numerator: 1, denominator: 3.5 },
          { numerator: 0, denominator: 1 },
        ]
        values.map(value => expect(isValid(value)).toEqual(true))
      })
      it('should return with false if the parameter is a invalid fraction number', () => {
        const values = [
          { numerator: 1, denominator: 'b' },
          { numerator: 1, denominator: NaN },
          { numerator: 1, denominator: null },
          { numerator: 1, denominator: undefined },
          { numerator: 1, denominator: {} },
          { numerator: 1, denominator: 0 },
        ]
        // @ts-expect-error
        values.map(value => expect(isValid(value)).toEqual(false))
      })
    })

    describe('fractionNum', () => {
      it('should accept number params', () => {
        const actual = fractionNum(1, 1)
        const expected = { numerator: 1, denominator: 1 }
        expect(actual).toEqual(expected)
      })

      it('should accept number as string', () => {
        const actual = fractionNum('1', '1')
        const expected = { numerator: 1, denominator: 1 }
        expect(actual).toEqual(expected)
      })

      it('should return with INVALID_FRACTION_NUMBER if one of the parameter is not a number', () => {
        const values = [null, undefined, NaN, 0, 'asd', '']

        values.map(value => {
          // @ts-expect-error
          expect(fractionNum('1', value)).toEqual(INVALID_FRACTION_NUMBER)
        })
      })
    })

    describe('simplifyFractionNumber', () => {
      it('should simplify the fraction number parameter', () => {
        const values = [
          [
            { numerator: 1, denominator: 1 },
            { numerator: 1, denominator: 1 },
          ],
          [
            { numerator: 10, denominator: 10 },
            { numerator: 1, denominator: 1 },
          ],
          [
            { numerator: 15, denominator: 9 },
            { numerator: 5, denominator: 3 },
          ],
          [
            { numerator: 9, denominator: 15 },
            { numerator: 3, denominator: 5 },
          ],
          [
            { numerator: 0, denominator: 1 },
            { numerator: 0, denominator: 1 },
          ],
        ]
        values.map(([value, expected]) => {
          const actual = simplifyFractionNumber(value)
          expect(actual).toEqual(expected)
        })
      })
    })
  })
})
