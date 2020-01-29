import { renderHook } from '@testing-library/react-hooks'
import { useDocumentEvent, useWindowEvent } from './events'

test('should register and unregister event listener on document', () => {
  const cb = jest.fn()
  document.addEventListener = jest.fn()
  document.removeEventListener = jest.fn()

  const { unmount } = renderHook(() => useDocumentEvent('drag', cb))

  expect((document.addEventListener as any).mock.calls).toEqual([['drag', cb]])

  unmount()
  expect((document.removeEventListener as any).mock.calls).toEqual([['drag', cb]])
})

test('should register and unregister event listener on window', () => {
  const cb = jest.fn()
  window.addEventListener = jest.fn()
  window.removeEventListener = jest.fn()

  const { unmount } = renderHook(() => useWindowEvent('click', cb))

  expect((window.addEventListener as any).mock.calls.filter(([t]) => t === 'click')).toEqual([
    ['click', cb]
  ])

  unmount()
  expect((window.removeEventListener as any).mock.calls.filter(([t]) => t === 'click')).toEqual([
    ['click', cb]
  ])
})
