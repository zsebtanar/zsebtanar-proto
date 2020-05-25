import { stringUtils } from './stringUtils'

describe('string utils', () => {
  test('to-capital', () => {
    const fn = stringUtils['to-capital']
    expect(fn('')).toEqual('')
    expect(fn('a')).toEqual('A')
    expect(fn('abc')).toEqual('Abc')
    expect(fn('Abc')).toEqual('Abc')
    expect(fn('😀🐧')).toEqual('🐧😀')
  })
})
