import { combineReducers } from 'redux'
import app from 'shared/store/reducers/index'
import classification from './classification'

export default combineReducers({
  app,
  classification
})
