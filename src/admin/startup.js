import configureStore from './store/index'
import { initAuthWatch } from 'shared/store/actions/auth'
import { initHistory } from 'shared/history'

export function startup() {
  const initialState = window.__INITIAL_STATE__ || {}
  const store = configureStore(initialState)
  const history = initHistory('/admin/', store)

  initAuthWatch(store)

  return Promise.resolve({ store, history })
}
