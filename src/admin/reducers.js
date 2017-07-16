import { combineReducers } from 'redux'
import app from 'store/reducers'
import exercise from 'store/reducers/exercise'

export default combineReducers({
  app,
  exercise
})
