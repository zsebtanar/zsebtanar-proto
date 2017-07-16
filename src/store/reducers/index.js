import { combineReducers } from 'redux'
import session from './session'
import modal from './modal'

const rootReducer = combineReducers({
  session,
  modal
})

export default rootReducer
