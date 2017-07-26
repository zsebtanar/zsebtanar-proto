import { combineReducers } from 'redux'
import app from 'store/reducers'
import history from './Routes'

export default combineReducers({
  app,
  history
})
