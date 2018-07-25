import { combineReducers } from 'redux'
import session from './reducers/session'
import modal from './reducers/modal'
import sideNav from './reducers/sideNav'
import { exerciseReducer as exercise } from './exercise'
import { classificationReducer as classifications } from './classifications'

export const rootReducer = combineReducers({
  session,
  modal,
  sideNav,
  exercise,
  classifications
})
