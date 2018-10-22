const SCROLL_POSITION_KEY = 'scrollPos'

function getItem(key: string, base: any = {}, store = window.sessionStorage) {
  return JSON.parse(store.getItem(key)) || base
}

function setItem(key: string, data: any, store = window.sessionStorage) {
  store.setItem(key, JSON.stringify(data))
}

export function storeScrollPos(pageId: string, position: number) {
  const data = getItem(SCROLL_POSITION_KEY)
  data[pageId] = position
  setItem(SCROLL_POSITION_KEY, data)
}

export function getScrollPos(pageId) {
  return getItem(SCROLL_POSITION_KEY)[pageId] || 0
}
