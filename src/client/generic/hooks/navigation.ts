import { useEffect, useLayoutEffect, RefObject } from 'react'
import { useLocation } from 'react-router'

/**
 * Focus lock
 *
 * Prevent to focus on any element except inside the specified element by keyboard
 * @see https://gist.github.com/danethurber/a586dbc9097e2e5696719c390a00c683
 */
const FOCUSABLE_SELECTORS = [
  '[contenteditable]:not([contenteditable="false"])',
  '[tabindex]',
  'a[href]',
  'audio[controls]',
  'button',
  'iframe',
  'input',
  'select',
  'textarea',
  'video[controls]',
]

const hasNegativeTabIndex = (el: Element) =>
  el.getAttribute('tabindex') && Number(el.getAttribute('tabindex')) < 0

const getFocusableChildNodes = (el: Element) => {
  const selectAll = FOCUSABLE_SELECTORS.join(',')
  const nodeList = el.querySelectorAll(selectAll)

  return Array.from(nodeList || []).filter((node) => !hasNegativeTabIndex(node))
}

export function useFocusLock(ref: RefObject<Element>): void {
  useEffect(() => {
    const prevFocusedElement = document.activeElement

    let focusableNodes: HTMLElement[] = []

    if (ref && ref.current) {
      focusableNodes = getFocusableChildNodes(ref.current) as HTMLElement[]

      const firstNode = focusableNodes[0]
      if (firstNode) firstNode.focus()
    }

    const onKeyDown = (event) => {
      const isTab = event.key === 'Tab'
      const withShiftKey = event.shiftKey

      if (!isTab) {
        return
      }

      const { activeElement } = document

      const first = focusableNodes[0]
      const last = focusableNodes[focusableNodes.length - 1]

      if (activeElement === first && withShiftKey) {
        last.focus()
        event.preventDefault()
        event.stopPropagation()
      } else if (activeElement === last && !withShiftKey) {
        first.focus()
        event.preventDefault()
        event.stopPropagation()
      }
    }

    window.addEventListener('keydown', onKeyDown)

    return function cleanup() {
      window.removeEventListener('keydown', onKeyDown)
      if (prevFocusedElement instanceof HTMLElement) {
        prevFocusedElement.focus()
      }
    }
  })
}

/**
 * Lock body scroll hook
 *
 * @see https://gist.github.com/danethurber/a586dbc9097e2e5696719c390a00c683
 */
export function useLockBodyScroll(): void {
  useLayoutEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'visible'
    }
  }, [])
}

export function useQuery(): URLSearchParams {
  return new URLSearchParams(useLocation().search)
}
