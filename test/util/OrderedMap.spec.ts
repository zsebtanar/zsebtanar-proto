import { removeFromObjById } from '../../src/client-common/util/OrderedMap'

describe('OrderedMap', () => {
  it('should pass with an empty object', () => {
    expect(removeFromObjById('key', {})).toEqual({})
  })

  it('should pass with non-empty object', () => {
    expect(removeFromObjById('a', { a: { order: 1 }, b: { order: 2 }, c: { order: 0 } })).toEqual({
      b: { order: 1 },
      c: { order: 0 }
    })
  })
})
