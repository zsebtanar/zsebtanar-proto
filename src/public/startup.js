import configureStore from './store/index'
import { initClassifications } from './store/classification'
import { initAuthWatch } from 'shared/store/actions/auth'
import { initHistory } from 'shared/history'
import ReactGA from 'react-ga'

ReactGA.initialize(__GA__.ua, { debug: __DEV__ })
ReactGA.pageview(window.location.pathname + window.location.search)

export default function() {
  const initialState = window.__INITIAL_STATE__ || {}
  const store = configureStore(initialState)
  const history = initHistory('/', store)

  initClassifications(store)

  initAuthWatch(store)

  return Promise.resolve({ store, history })
}
