import { applyMiddleware, compose, createStore } from 'redux'
import thunk from 'redux-thunk'
import rootReducer from './reducers'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

export default function configureStore (initialState) {
  const middlewares = [thunk]
  if (__DEV__) {
    const logger = require(`redux-logger`).createLogger({collapsed: true})
    middlewares.push(logger)
  }

  const store = composeEnhancers(applyMiddleware(...middlewares))(createStore)(rootReducer, initialState)

  if (typeof module !== 'undefined' && module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('./reducers', () => {
      const nextRootReducer = require('./reducers')
      store.replaceReducer(nextRootReducer)
    })
  }

  return store
}
