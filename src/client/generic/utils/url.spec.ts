import { getQueryParams } from 'client/generic/utils/url'

describe('getQueryParams', () => {
  it('should not fail with empty string', () => {
    const actual = getQueryParams('', '')
    const expected = undefined
    expect(actual).toEqual(expected)
  })

  it('should return with the right parameter value if the param exist', () => {
    const actual = getQueryParams('hello=world&xyz=12&nope', 'xyz')
    const expected = '12'
    expect(actual).toEqual(expected)
  })

  it('should return with the undefined if param is not exist', () => {
    const actual = getQueryParams('hello=world&xyz=12&nope', 'abc')
    const expected = undefined
    expect(actual).toEqual(expected)
  })

  it('should return with the undefined if param is empty string', () => {
    const actual = getQueryParams('hello=world&xyz=12&nope', '')
    const expected = undefined
    expect(actual).toEqual(expected)
  })
})
