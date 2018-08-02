import 'client-common/fireApp'
import { configureStore } from './store'
import { initAuthWatch } from 'client-common/store/actions/auth'
import { initHistory } from 'client-common/history'

export function startup() {
  const initialState = (window as any).__INITIAL_STATE__ || {}
  const store = configureStore(initialState)
  const history = initHistory('/admin/', store)

  initAuthWatch(store)

  return Promise.resolve({ store, history })
}
