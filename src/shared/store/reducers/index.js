import { combineReducers } from 'redux'
import session from './session'
import modal from './modal'
import sideNav from './sideNav'

const rootReducer = combineReducers({
  session,
  modal,
  sideNav
})

export default rootReducer
