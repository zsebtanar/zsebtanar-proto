import { combineReducers } from 'redux'
import session from './session'
import exercise from './exercise'
import modal from './modal'

const rootReducer = combineReducers({
  session,
  exercise,
  modal,
  app: () => ({})
})

export default rootReducer