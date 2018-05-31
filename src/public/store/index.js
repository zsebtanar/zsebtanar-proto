import { applyMiddleware, compose, createStore } from 'redux'
import thunk from 'redux-thunk'
import rootReducer from './reducers'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

export default function configureStore(initialState) {
  const middlewareList = [thunk]
  if (__DEV__) {
    const logger = require(`redux-logger`).createLogger({ collapsed: true })
    middlewareList.push(logger)
  }

  const store = composeEnhancers(applyMiddleware(...middlewareList))(createStore)(
    rootReducer,
    initialState
  )

  if (typeof module !== 'undefined' && module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('./reducers', () => {
      const nextRootReducer = require('./reducers')
      store.replaceReducer(nextRootReducer)
    })
  }

  return store
}
