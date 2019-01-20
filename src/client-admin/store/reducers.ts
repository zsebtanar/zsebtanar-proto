import { rootReducer as app } from 'client-common/store/index'
import { combineReducers } from 'redux'
import { exerciseSheetReducer as exerciseSheet } from '../page/exerciseSheet/exerciseSheetReducer'
import { exerciseFormReducer as exerciseEdit } from '../page/exerciseEdit/exerciseFormReducer'

export default combineReducers({
  app,
  exerciseEdit,
  exerciseSheet
})
