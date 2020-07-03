const SCROLL_POSITION_KEY = 'scrollPos'

function getItem<T = unknown>(key: string, fallback?: T, store = window.sessionStorage): T {
  const item = store.getItem(key)
  return item ? JSON.parse(item) : (fallback as T)
}

function setItem(key: string, fallback: unknown, store = window.sessionStorage) {
  store.setItem(key, JSON.stringify(fallback))
}

export function storeScrollPos(pageId: string, position: number): void {
  const data = getItem<Record<string, number>>(SCROLL_POSITION_KEY, {})
  data[pageId] = position
  setItem(SCROLL_POSITION_KEY, data)
}

export function getScrollPos(pageId: string): number {
  return getItem<Record<string, number>>(SCROLL_POSITION_KEY, {})[pageId] || 0
}
