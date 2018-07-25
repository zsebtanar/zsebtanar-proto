import createHistory from 'history/createBrowserHistory'

let history

export function initHistory(basename, store) {
  history = createHistory({
    basename,
    forceRefresh: false,
    getUserConfirmation: (message, callback) => callback(window.confirm(message)),
    keyLength: 6
  })
  return history
}

export default history
