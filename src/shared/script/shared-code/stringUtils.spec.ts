import { stringUtils } from './stringUtils'
import { plString } from 'pocket-lisp-stdlib'

describe('string utils', () => {
  test('to-capital', () => {
    const fn = stringUtils['to-capital']
    expect(fn(plString(''))).toEqual(plString(''))
    expect(fn(plString('a'))).toEqual(plString('A'))
    expect(fn(plString('abc'))).toEqual(plString('Abc'))
    expect(fn(plString('Abc'))).toEqual(plString('Abc'))
    expect(fn(plString('😀🐧'))).toEqual(plString('😀🐧'))
  })
})
