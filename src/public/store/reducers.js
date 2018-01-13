import { combineReducers } from 'redux'
import { rootReducer as app } from 'shared/store'
import classification from './classification'

export default combineReducers({
  app,
  classification
})
