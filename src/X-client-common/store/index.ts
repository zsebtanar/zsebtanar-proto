import { combineReducers } from 'redux'
import session from './reducers/session'
import modal from './reducers/modal'
import sideNav from './reducers/sideNav'
import { classificationReducer as classifications } from './classifications'
import { notificationReducer as notifications } from './notifications'

export const rootReducer = combineReducers<state.App>({
  session,
  modal,
  sideNav,
  classifications,
  notifications
})
