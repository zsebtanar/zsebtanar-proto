import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import Routes from './Routes'
import startUp from './startup'

startUp().then(({ store, history }) => {
  ReactDOM.render(
    <Provider store={store}>
      <Routes history={history} />
    </Provider>,
    document.getElementById('root')
  )
})
