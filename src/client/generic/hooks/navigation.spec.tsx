import { render } from '@testing-library/react'
import { renderHook } from '@testing-library/react-hooks'
import { useLockBodyScroll, useFocusLock } from './navigation'
import React, { useRef } from 'react'

test('useLockBodyScroll body class changes', () => {
  expect(document.body.style.overflow).toBe('')

  const { unmount } = renderHook(() => useLockBodyScroll())
  expect(document.body.style.overflow).toBe('hidden')
  unmount()

  expect(document.body.style.overflow).toBe('visible')
})

test('useFocusLock', () => {
  const event = { preventDefault: jest.fn(), stopPropagation: jest.fn() }
  const eventMap: any = {}
  window.addEventListener = jest.fn((event, cb) => {
    eventMap[event] = cb
  })

  function Component() {
    const ref = useRef<HTMLDivElement>(null)
    useFocusLock(ref)

    return (
      <div ref={ref}>
        <a href="#">link</a>
        <button>submit</button>
      </div>
    )
  }

  render(<Component />)

  // the js dom does not handle tab focus
  // so we just test the edge cases

  eventMap.keydown({ key: 'Tab', ...event })
  expect(document.activeElement?.tagName).toBe('A')
  eventMap.keydown({ key: 'Tab', shiftKey: true, ...event })
  expect(document.activeElement?.tagName).toBe('BUTTON')
  eventMap.keydown({ key: 'Tab', ...event })
  expect(document.activeElement?.tagName).toBe('A')
})
