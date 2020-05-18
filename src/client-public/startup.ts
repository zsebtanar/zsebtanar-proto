import 'client-common/fireApp'
import * as ReactGA from 'react-ga'
import { configureStore } from './store'
import { initClassifications } from './store/classification'
import { initAuthWatch } from 'client-common/store/actions/auth'
import { initHistory } from 'client-common/history'

ReactGA.initialize(__CONFIG__.ga.ua, { debug: __DEV__ })
ReactGA.set({ anonymizeIp: true })
ReactGA.pageview(window.location.pathname + window.location.search)

let started = false
let store = undefined
let history = undefined

export function startup() {
  if (!started) {
    const initialState = (window as any).__INITIAL_STATE__ || {}
    store = configureStore(initialState)
    history = initHistory('/', store)

    initClassifications(store)

    initAuthWatch(store)
    started = true
  }

  return Promise.resolve({ store, history })
}
