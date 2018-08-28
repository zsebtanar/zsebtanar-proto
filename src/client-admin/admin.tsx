import * as React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { Routes } from './Routes'
import { startup } from './startup'

import 'react-select/scss/default.scss'
import 'client-common/style/libs/github-markdown.css'
import 'client-common/style/admin.scss'

startup().then(({ store, history }) => {
  render(
    <Provider store={store}>
      <Routes history={history} />
    </Provider>,
    document.getElementById('root')
  )
})
