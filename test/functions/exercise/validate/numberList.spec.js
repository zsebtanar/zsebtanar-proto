import { numberList } from '../../../../functions/src/exercise/validate/userControls/numberList'

const ARO = { controlProps: { acceptRandomOrder: true } }

describe('numberList', () => {
  it('should pass with empty params', () => {
    expect(numberList()).toBe(true)
  })

  describe('with accept random order', () => {
    it('should pass if the the solutions is empty', () => {
      expect(numberList(ARO, {}))
    })
    it('should pass if the user input contains the same values as the solution', () => {
      ;[
        { solution: { options: {} }, input: {} },
        { solution: { options: { a: 1 } }, input: { a: 1 } },
        { solution: { options: { a: 1, b: 2 } }, input: { a: 1, b: 2 } },
        { solution: { options: { a: 2, b: 1 } }, input: { a: 2, b: 1 } },
        { solution: { options: { a: 2, b: 1, c: 1 } }, input: { a: 2, b: 1, d: 1 } }
      ].map(({ solution, input }) => expect(numberList(ARO, solution, input)).toBe(true))
    })
    it('should fail if the user input contains different values as the solution', () => {
      ;[
        { solution: { options: {} }, input: { a: 1 } },
        { solution: { options: { a: 1 } }, input: {} },
        { solution: { options: { a: 1 } }, input: { a: 2 } },
        { solution: { options: { a: 1, b: 2 } }, input: { a: 2 } },
        { solution: { options: { a: 1, b: 2 } }, input: { a: 2, b: 2 } },
        { solution: { options: { a: 2, b: 1, c: 1 } }, input: { a: 2, b: 1, d: 2 } }
      ].map(({ solution, input }) => expect(numberList(ARO, solution, input)).toBe(false))
    })
  })

  describe('with strict order', () => {
    it('should pass if the the solutions is empty', () => {
      expect(numberList(ARO, {}))
    })
    it('should pass if the user input contains the same values as the solution', () => {
      ;[
        { solution: { options: {} }, input: {} },
        { solution: { options: { a: 1 } }, input: { a: 1 } },
        { solution: { options: { a: 1, b: 2 } }, input: { a: 1, b: 2 } },
        { solution: { options: { a: 2, c: 1, b: 1 } }, input: { a: 2, b: 1, c: 1 } }
      ].map(({ solution, input }) => expect(numberList(ARO, solution, input)).toBe(true))
    })
    it('should fail if the user input contains different values as the solution', () => {
      ;[
        { solution: { options: {} }, input: { a: 1 } },
        { solution: { options: { a: 1 } }, input: {} },
        { solution: { options: { a: 1 } }, input: { a: 2 } },
        { solution: { options: { a: 1, b: 2 } }, input: { a: 2 } },
        { solution: { options: { a: 1, b: 2 } }, input: { a: 2, b: 2 } },
        { solution: { options: { a: 2, b: 1, c: 1 } }, input: { a: 2, b: 1, d: 2 } }
      ].map(({ solution, input }) => expect(numberList(ARO, solution, input)).toBe(false))
    })
  })
})
