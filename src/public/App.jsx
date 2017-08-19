import React from 'react'
import { Provider } from 'react-redux'
import configureStore from './store'
import Routes from './Routes'
import { watchAuth } from 'shared/store/actions/auth'
import { initClassifications } from 'public/store/classification'

const initialState = window.__INITIAL_STATE__ || {}
const store = configureStore(initialState)

export default () => (
  <Provider store={store}>
    <Routes/>
  </Provider>
)

watchAuth(store)
initClassifications(store)
