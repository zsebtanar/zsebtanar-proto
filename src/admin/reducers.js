import { combineReducers } from 'redux'
import app from 'store/reducers'
import history from './Routes'
import exercise from 'store/reducers/exercise'

export default combineReducers({
  app,
  history,
  exercise
})
