import {createStore, applyMiddleware, compose} from 'redux'
import thunk from 'redux-thunk'
import rootReducer from './reducer'

export default function configureStore(initialState, history) {
  const middlewares = [thunk];
  if (__DEV__ !== `production`) {
    const logger = require(`redux-logger`).createLogger({ collapsed: true })
    middlewares.push(logger);
  }

  const store = compose(applyMiddleware(...middlewares))(createStore)(rootReducer);

  if (typeof module !== 'undefined' && module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('./reducer', () => {
      const nextRootReducer = require('./reducer')
      store.replaceReducer(nextRootReducer)
    })
  }

  return store
}