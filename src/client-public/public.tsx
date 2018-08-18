import * as React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { Recaptcha } from 'client-common/component/util/Recaptcha'
import { Routes } from './Routes'
import { startup } from './startup'

import 'bootstrap/scss/bootstrap.scss'
import 'client-common/style/main.scss'

startup().then(({ store, history }) => {
  const root = document.getElementById('root')
  root.innerHTML = ''
  render(
    <Provider store={store}>
      <Recaptcha>
        <Routes history={history} />
      </Recaptcha>
    </Provider>,
    root
  )
})
