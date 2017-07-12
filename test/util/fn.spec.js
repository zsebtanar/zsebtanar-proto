import { pairsInOrder } from '../../functions/fn'

test('pairsInOrder an empty object', () => {
  expect(pairsInOrder({})).toEqual([])
})

test('pairsInOrder an not empty object with order property', () => {
  expect(pairsInOrder({a: {order: 1}, b: {order: 100}, c: {order: 0}}))
    .toEqual([['c', {order: 0}], ['a', {order: 1}], ['b', {order: 100}]])
})

test('pairsInOrder an not empty object without order property', () => {
  expect(pairsInOrder({a: {}, b: {}, c: {}}))
    .toEqual([['a', {}], ['b', {}], ['c', {}]])
})
