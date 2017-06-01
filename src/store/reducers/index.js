import { combineReducers } from 'redux'
import session from './session'

const rootReducer = combineReducers({
  session,
  app: () => ({})
})

export default rootReducer