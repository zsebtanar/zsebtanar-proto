import { identity } from 'ramda'
import { assert, pairsInOrder } from '../../src/shared/util/fn'

describe('pairsInOrder', () => {
  it('an empty object', () => {
    expect(pairsInOrder({})).toEqual([])
  })

  it('an not empty object with order property', () => {
    expect(pairsInOrder({a: {order: 1}, b: {order: 100}, c: {order: 0}}))
      .toEqual([['c', {order: 0}], ['a', {order: 1}], ['b', {order: 100}]])
  })

  it('an not empty object without order property', () => {
    expect(pairsInOrder({a: {}, b: {}, c: {}}))
      .toEqual([['a', {}], ['b', {}], ['c', {}]])
  })
})

describe('assert', () => {
  it('should throw error if the predication is false', () => {
    expect(() => assert(identity, 'custom error message', false)).toThrow('custom error message')
  })

  it('should not throw error if the predication is true', () => {
    expect(() => assert(identity, 'custom error message', true)).not.toThrow('custom error message')
  })
})
