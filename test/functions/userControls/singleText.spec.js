import simpleText from '../../../functions/userControls/simpleText'

describe('simpleText', () => {
  it('should pass in the simplest case', () => {
    const solutionObj = {
      caseSensitive: false,
      ignoreSpaces: false,
      options: {1: 'a'}
    }
    expect(simpleText(null, solutionObj, 'a')).toBe(true)
  })

  it('should pass if the solution is part of the options', () => {
    const solutionObj = {
      caseSensitive: false,
      ignoreSpaces: false,
      options: {1: 'b', 2: 'c', 3: 'a'}
    }
    expect(simpleText(null, solutionObj, 'a')).toBe(true)
  })

  it('should fail if the solution is not part of the options', () => {
    const solutionObj = {
      caseSensitive: false,
      ignoreSpaces: false,
      options: {1: 'b', 2: 'c', 3: 'a'}
    }
    expect(simpleText(null, solutionObj, 'd')).toBe(false)
  })

  it('should fail if caseSensitive is on and not match the input with the options', () => {
    const solutionObj = {
      caseSensitive: true,
      ignoreSpaces: false,
      options: {1: 'b', 2: 'c', 3: 'a'}
    }
    expect(simpleText(null, solutionObj, 'A')).toBe(false)
  })

  it('should fail if the input spaces not match with the options', () => {
    const solutionObj = {
      caseSensitive: true,
      ignoreSpaces: false,
      options: {1: 'b', 2: 'c', 3: 'a'}
    }
    expect(simpleText(null, solutionObj, ' a ')).toBe(false)
  })

  it('should pass if the input spaces not match with the options but the ignoreSpaces is on', () => {
    const solutionObj = {
      caseSensitive: true,
      ignoreSpaces: true,
      options: {1: 'b', 2: 'c', 3: 'a'}
    }
    expect(simpleText(null, solutionObj, ' a ')).toBe(true)
  })

  it('should fail if the ignoreSpaces is on but the letter case not match', () => {
    const solutionObj = {
      caseSensitive: true,
      ignoreSpaces: true,
      options: {1: 'b', 2: 'c', 3: 'a'}
    }
    expect(simpleText(null, solutionObj, ' A ')).toBe(false)
  })

  it('should pass if the ignoreSpaces and the caseSensitive turned off', () => {
    const solutionObj = {
      caseSensitive: false,
      ignoreSpaces: true,
      options: {1: 'b', 2: 'c', 3: 'a'}
    }
    expect(simpleText(null, solutionObj, ' A ')).toBe(true)
  })
})
