import { combineReducers } from 'redux'
import app from 'shared/store/reducers/index'
import exercise from 'shared/store/reducers/exercise'

export default combineReducers({
  app,
  exercise
})
