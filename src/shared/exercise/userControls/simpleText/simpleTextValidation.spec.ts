import { simpleTextValidation as simpleText } from './simpleTextValidation'
import { ExerciseSubTaskControlsType, UCSimpleText } from 'shared/exercise/types'

describe('simpleText', () => {
  const baseCtrl: UCSimpleText = {
    type: ExerciseSubTaskControlsType.SimpleText,
    name: 'test',
    isDynamic: false,
    props: {
      ignoreSpaces: true,
      caseSensitive: true,
    },
    solution: [], // not used
  }

  it('should pass in the simplest case', () => {
    const ctrl: UCSimpleText = {
      ...baseCtrl,
      props: {
        caseSensitive: false,
        ignoreSpaces: false,
      },
    }
    expect(simpleText(ctrl, ['a'], 'a')).toBe(true)
  })

  it('should fail if the input is empty', () => {
    const ctrl: UCSimpleText = {
      ...baseCtrl,
      props: {
        caseSensitive: false,
        ignoreSpaces: false,
      },
    }

    const emptyInputs = ['', null, undefined]
    emptyInputs.map((input) => expect(simpleText(ctrl, [], input as string)).toBe(false))
  })

  it('should fail if the input and the options list are empty', () => {
    const ctrl: UCSimpleText = {
      ...baseCtrl,
      props: {
        caseSensitive: false,
        ignoreSpaces: false,
      },
    }

    const emptyInputs = ['', null, undefined, 'a']
    emptyInputs.map((input) => expect(simpleText(ctrl, [], input as string)).toBe(false))
  })

  it('should pass if the solution is part of the options', () => {
    const ctrl: UCSimpleText = {
      ...baseCtrl,
      props: {
        caseSensitive: false,
        ignoreSpaces: false,
      },
    }
    expect(simpleText(ctrl, ['a'], 'a')).toBe(true)
  })

  it('should fail if the solution is not part of the options', () => {
    const ctrl: UCSimpleText = {
      ...baseCtrl,
      props: {
        caseSensitive: false,
        ignoreSpaces: false,
      },
    }
    expect(simpleText(ctrl, ['d'], 'a')).toBe(false)
  })

  it('should fail if caseSensitive is on and not match the input with the options', () => {
    const ctrl: UCSimpleText = {
      ...baseCtrl,
      props: {
        caseSensitive: true,
        ignoreSpaces: false,
      },
    }
    expect(simpleText(ctrl, ['a'], 'A')).toBe(false)
  })

  it('should fail if the input spaces not match with the options', () => {
    const ctrl: UCSimpleText = {
      ...baseCtrl,
      props: {
        caseSensitive: true,
        ignoreSpaces: false,
      },
    }
    expect(simpleText(ctrl, ['a'], ' a ')).toBe(false)
  })

  it('should pass if the input spaces not match with the options but the ignoreSpaces is on', () => {
    const ctrl: UCSimpleText = {
      ...baseCtrl,
      props: {
        caseSensitive: true,
        ignoreSpaces: true,
      },
    }
    expect(simpleText(ctrl, ['a'], ' a ')).toBe(true)
  })

  it('should fail if the ignoreSpaces is on but the letter case not match', () => {
    const ctrl: UCSimpleText = {
      ...baseCtrl,
      props: {
        caseSensitive: true,
        ignoreSpaces: true,
      },
    }
    expect(simpleText(ctrl, ['a'], ' A ')).toBe(false)
  })

  it('should pass if the ignoreSpaces and the caseSensitive turned off', () => {
    const ctrl: UCSimpleText = {
      ...baseCtrl,
      props: {
        caseSensitive: false,
        ignoreSpaces: true,
      },
    }
    expect(simpleText(ctrl, ['a'], ' A ')).toBe(true)
  })
})
