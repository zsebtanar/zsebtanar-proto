import { useEffect, RefObject } from 'react'

/**
 * Register/unregister a callback for the specified window's event
 */
export function useWindowEvent<K extends keyof WindowEventMap>(
  event: K,
  callback: (this: Window, ev: WindowEventMap[K]) => void
) {
  useEffect(() => {
    window.addEventListener(event, callback)
    return () => window.removeEventListener(event, callback)
  }, [event, callback])
}

/**
 * Register/unregister a callback for the specified document's event
 */
export function useDocumentEvent<K extends keyof DocumentEventMap>(
  event: K,
  callback: (this: Document, ev: DocumentEventMap[K]) => void,
  capture = false
) {
  useEffect(() => {
    document.addEventListener(event, callback, capture)
    return () => document.removeEventListener(event, callback, capture)
  }, [])
}

/**
 * Register/unregister a callback on the global kay up event
 *
 * @param targetKey
 * @param handler
 * @see https://gist.github.com/danethurber/a586dbc9097e2e5696719c390a00c683
 */
export function useKeyUp(targetKey: string, handler: () => void) {
  const onKeyUp = ({ key }) => {
    if (key === targetKey) handler()
  }

  useWindowEvent('keyup', onKeyUp)
}

/**
 * Click outside a specified element hook
 *
 * @param ref
 * @param handler
 * @see https://gist.github.com/danethurber/a586dbc9097e2e5696719c390a00c683
 */
export function useOnClickOutside(
  ref: RefObject<Element>,
  handler: (event: MouseEvent | TouchEvent) => void
) {
  useEffect(() => {
    const listener = event => {
      if (!ref.current || ref.current.contains(event.target)) return
      handler(event)
    }

    document.addEventListener('mousedown', listener)
    document.addEventListener('touchstart', listener)

    return () => {
      document.removeEventListener('mousedown', listener)
      document.removeEventListener('touchstart', listener)
    }
  }, [])
}
