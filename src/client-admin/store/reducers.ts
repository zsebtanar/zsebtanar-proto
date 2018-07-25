import { combineReducers } from 'redux'
import { rootReducer as app } from 'client-common/store/index'
import { exerciseEditReducer as exerciseEdit } from './exerciseEdit'

export default combineReducers({
  app,
  exerciseEdit
})
