import { renderHook } from '@testing-library/react-hooks'
import { useDocumentEvent, useWindowEvent } from './events'
import { mocked } from 'ts-jest/utils'

test('should register and unregister event listener on document', () => {
  const cb = jest.fn()
  document.addEventListener = jest.fn()
  document.removeEventListener = jest.fn()

  const { unmount } = renderHook(() => useDocumentEvent('drag', cb))

  expect(mocked(document.addEventListener).mock.calls).toEqual([['drag', cb, false]])

  unmount()
  expect(mocked(document.removeEventListener).mock.calls).toEqual([['drag', cb, false]])
})

test('should register and unregister event listener on window', () => {
  const cb = jest.fn()
  window.addEventListener = jest.fn()
  window.removeEventListener = jest.fn()

  const { unmount } = renderHook(() => useWindowEvent('click', cb))

  expect(mocked(window.addEventListener).mock.calls.filter(([t]) => t === 'click')).toEqual([
    ['click', cb],
  ])

  unmount()
  expect(mocked(window.removeEventListener).mock.calls.filter(([t]) => t === 'click')).toEqual([
    ['click', cb],
  ])
})
