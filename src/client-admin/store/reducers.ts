import { rootReducer as app } from 'client-common/store/index'
import { combineReducers } from 'redux'
import { exerciseListFormReducer as exerciseList } from '../page/excerciseList/exerciseListFormReducer'
import { exerciseFormReducer as exerciseEdit } from '../page/exerciseEdit/exerciseFormReducer'

export default combineReducers({
  app,
  exerciseEdit,
  exerciseList
})
