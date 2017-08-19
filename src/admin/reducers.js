import { combineReducers } from 'redux'
import app from 'shared/store/reducers'
import history from './Routes'
import exercise from 'shared/store/reducers/exercise'

export default combineReducers({
  app,
  history,
  exercise
})
