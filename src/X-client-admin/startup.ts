import 'client/generic/services/fireApp'
import { configureStore } from './store'
import { initAuthWatch } from 'client-common/store/actions/auth'
import { initHistory } from 'client/generic/utils/history'

export function startup() {
  const initialState = window['__INITIAL_STATE__'] ?? {}
  const store = configureStore(initialState)
  const history = initHistory('/admin/')

  initAuthWatch(store)

  return Promise.resolve({ store, history })
}
