import 'client/generic/services/fireApp'
import * as ReactGA from 'react-ga'
import { configureStore } from './store'
import { initClassifications } from './store/classification'
import { initAuthWatch } from 'client-common/store/actions/auth'
import { initHistory } from 'client/generic/utils/history'

ReactGA.initialize(__CONFIG__.ga.ua, { debug: __DEV__ })
ReactGA.set({anonymizeIp: true})
ReactGA.pageview(window.location.pathname + window.location.search)

export function startup() {
  const initialState = (window as any).__INITIAL_STATE__ || {}
  const store = configureStore(initialState)

  initClassifications(store)

  initAuthWatch(store)

  return Promise.resolve({ store, history })
}
