import { useEffect } from 'react'

export function useDocumentEvent<K extends keyof DocumentEventMap>(
  event: K,
  callback: (this: Document, ev: DocumentEventMap[K]) => void
) {
  useEffect(() => {
    document.addEventListener(event, callback)
    return () => document.removeEventListener(event, callback)
  }, [event, callback])
}

export function useWindowEvent<K extends keyof WindowEventMap>(
  event: K,
  callback: (this: Window, ev: WindowEventMap[K]) => void
) {
  useEffect(() => {
    window.addEventListener(event, callback)
    return () => window.removeEventListener(event, callback)
  }, [event, callback])
}
