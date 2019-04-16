import { numberList } from 'server/exercise/validate/userControls/numberList'

type TestList = { solution: DB.UCNumberListSolution; input: DB.UCNumberListInput }[]

const ARO = <DB.UCNumberList>{ controlProps: { acceptRandomOrder: true } }
const NoSolution = {} as DB.UCNumberListSolution

describe('numberList', () => {
  it('should pass with empty params', () => {
    expect(numberList()).toBe(true)
  })

  describe('with accept random order', () => {
    it('should pass if the the solutions is empty', () => {
      expect(numberList(ARO, NoSolution))
    })

    it('should pass if the user input contains the same values as the solution', () => {
      const testList = [
        { solution: { options: {} }, input: {} },
        { solution: { options: { a: '1' } }, input: { a: '1' } },
        { solution: { options: { a: '1', b: '2' } }, input: { a: '1', b: '2' } },
        { solution: { options: { a: '2', b: '1' } }, input: { a: '2', b: '1' } },
        { solution: { options: { a: '2', b: '1', c: '1' } }, input: { a: '2', b: '1', c: '1' } }
      ] as TestList

      testList.map(({ solution, input }) => expect(numberList(ARO, solution, input)).toBe(true))
    })

    it('should fail if the user input contains different values as the solution', () => {
      const testList = [
        { solution: { options: {} }, input: { a: '1' } },
        { solution: { options: { a: '1' } }, input: {} },
        { solution: { options: { a: '1' } }, input: { a: '2' } },
        { solution: { options: { a: '1', b: '2' } }, input: { a: '2' } },
        { solution: { options: { a: '1', b: '2' } }, input: { a: '2', b: '2' } },
        { solution: { options: { a: '2', b: '1', c: '1' } }, input: { a: '2', b: '1', d: '2' } }
      ] as TestList
      testList.map(({ solution, input }) => expect(numberList(ARO, solution, input)).toBe(false))
    })
  })

  describe('with strict order', () => {
    it('should pass if the the solutions is empty', () => {
      expect(numberList(ARO, NoSolution))
    })

    it('should pass if the user input contains the same values as the solution', () => {
      const testList = [
        { solution: { options: {} }, input: {} },
        { solution: { options: { a: '1' } }, input: { a: '1' } },
        { solution: { options: { a: '1', b: '2' } }, input: { a: '1', b: '2' } },
        { solution: { options: { a: '2', c: '1', b: '1' } }, input: { a: '2', b: '1', c: '1' } }
      ] as TestList
      testList.map(({ solution, input }) => expect(numberList(ARO, solution, input)).toBe(true))
    })

    it('should fail if the user input contains different values as the solution', () => {
      const testList = [
        { solution: { options: {} }, input: { a: '1' } },
        { solution: { options: { a: '1' } }, input: {} },
        { solution: { options: { a: '1' } }, input: { a: '2' } },
        { solution: { options: { a: '1', b: '2' } }, input: { a: '2' } },
        { solution: { options: { a: '1', b: '2' } }, input: { a: '2', b: '2' } },
        { solution: { options: { a: '2', b: '1', c: '1' } }, input: { a: '2', b: '1', d: '2' } }
      ] as TestList
      testList.map(({ solution, input }) => expect(numberList(ARO, solution, input)).toBe(false))
    })
  })

  describe('in edge cases it', () => {
    it('should validate correctly the numbers with fraction', () => {
      const testList = [
        { solution: { options: {a: '0'} }, input: { a: '0.00' } },
        { solution: { options: {a: '0.00'} }, input: { a: '0' } },
        { solution: { options: {a: '0.05'} }, input: { a: '0.05' } },
      ] as TestList
      testList.map(({ solution, input }) => expect(numberList(ARO, solution, input)).toBe(true))
    })
  })
})
