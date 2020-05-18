import 'client-common/fireApp'
import { configureStore } from './store'
import { initAuthWatch } from 'client-common/store/actions/auth'
import { initHistory } from 'client-common/history'

let started = false
let history = undefined
let store = undefined

export function startup() {
  if (!started) {
    const initialState: unknown = (window as any).__INITIAL_STATE__ || {}
    store = configureStore(initialState)
    history = initHistory('/admin/', store)

    initAuthWatch(store)
    started = true
  }
  return Promise.resolve({ store, history })
}
