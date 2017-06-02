import { combineReducers } from 'redux'
import session from './session'
import exercise from './exercise'

const rootReducer = combineReducers({
  session,
  exercise,
  app: () => ({})
})

export default rootReducer