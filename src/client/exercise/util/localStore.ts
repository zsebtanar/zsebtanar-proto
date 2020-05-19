const SCROLL_POSITION_KEY = 'scrollPos'

function getItem(key: string, fallback: unknown = {}, store = window.sessionStorage) {
  const item = store.getItem(key)
  return item ? JSON.parse(item) : fallback
}

function setItem(key: string, fallback: unknown, store = window.sessionStorage) {
  store.setItem(key, JSON.stringify(fallback))
}

export function storeScrollPos(pageId: string, position: number) {
  const data = getItem(SCROLL_POSITION_KEY)
  data[pageId] = position
  setItem(SCROLL_POSITION_KEY, data)
}

export function getScrollPos(pageId) {
  return getItem(SCROLL_POSITION_KEY)[pageId] || 0
}
