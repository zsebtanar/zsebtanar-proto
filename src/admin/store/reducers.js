import { combineReducers } from 'redux'
import { rootReducer as app } from 'shared/store'
import { exerciseEditReducer as exerciseEdit } from './exerciseEdit'

export default combineReducers({
  app,
  exerciseEdit
})
