import React from 'react'
import { Provider } from 'react-redux'
import configureStore from './store/store'
import Routes from './Routes'
import { watchAuth } from './store/actions/auth'

const initialState = window.__INITIAL_STATE__ || {}
const store = configureStore(initialState)

export default () => (
  <Provider store={store}>
    <Routes/>
  </Provider>
)

watchAuth(store)
