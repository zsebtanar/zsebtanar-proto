import 'client-common/fireApp'
import * as ReactGA from 'react-ga'
import { configureStore } from './store'
import { initClassifications } from './store/classification'
import { initAuthWatch } from 'client-common/store/actions/auth'
import { initHistory } from 'client-common/history'

ReactGA.initialize(__GA__.ua, { debug: __DEV__ })
ReactGA.pageview(window.location.pathname + window.location.search)

export function startup() {
  const initialState = (window as any).__INITIAL_STATE__ || {}
  const store = configureStore(initialState)
  const history = initHistory('/', store)

  initClassifications(store)

  initAuthWatch(store)

  return Promise.resolve({ store, history })
}
