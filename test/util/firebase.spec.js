import { resolveSnapshot } from '../../src/shared/util/firebase'

test('resolveSnapshot should call "val" method', () => {
  const x = {}
  const snapshot = {
    val () { return x }
  }
  expect(resolveSnapshot(snapshot)).toBe(x)
})
