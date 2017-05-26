import {propOr} from 'ramda'
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk';
import rootReducer from './reducer'

export default function configureStore (initialState, history) {
  const store = createStore(
    rootReducer,
    applyMiddleware(thunk),
    propOr(() => undefined, 'devToolsExtension', window)()
  );

  if (typeof module !== 'undefined' && module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('./reducer', () => {
      const nextRootReducer = require('./reducer')
      store.replaceReducer(nextRootReducer)
    })
  }

  return store
}