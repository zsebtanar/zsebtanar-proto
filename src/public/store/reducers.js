import { combineReducers } from 'redux'
import app from 'shared/store/reducers/index'
import classification from './classification'
import { exerciseReducer as exercise } from './exercise'

export default combineReducers({
  app,
  classification,
  exercise
})
