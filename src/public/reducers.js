import { combineReducers } from 'redux'
import app from 'shared/store/reducers'
import classification from './store/classification'
import history from './Routes'

export default combineReducers({
  app,
  classification,
  history
})
