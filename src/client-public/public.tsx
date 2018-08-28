import * as React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { Recaptcha } from 'client-common/component/util/Recaptcha'
import { Routes } from './Routes'
import { startup } from './startup'

import 'client-common/style/public.scss'

startup().then(({ store, history }) => {
  render(
    <Provider store={store}>
      <Recaptcha>
        <Routes history={history} />
      </Recaptcha>
    </Provider>,
    document.getElementById('root')
  )
})
