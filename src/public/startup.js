import configureStore from './store/index'
import { initClassifications } from './store/classification'
import { initAuthWatch } from 'shared/store/actions/auth'
import { initHistory } from 'shared/history'

export default function() {
  const initialState = window.__INITIAL_STATE__ || {}
  const store = configureStore(initialState)
  const history = initHistory('/', store)

  initClassifications(store)

  initAuthWatch(store)

  return Promise.resolve({ store, history })
}
