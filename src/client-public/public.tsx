import * as React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { Routes } from './Routes'
import { startup } from './startup'

import 'bootstrap/scss/bootstrap.scss'
import 'client-common/style/main.scss'

startup().then(({ store, history }) => {
  render(
    <Provider store={store}>
      <Routes history={history} />
    </Provider>,
    document.getElementById('root')
  )
})
