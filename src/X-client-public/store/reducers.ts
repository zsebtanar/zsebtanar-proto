import { combineReducers } from 'redux'
import { rootReducer as app } from 'client-common/store/index'
import classification from './classification'

export default combineReducers({
  app,
  classification
})
