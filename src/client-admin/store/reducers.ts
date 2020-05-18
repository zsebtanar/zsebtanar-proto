import { rootReducer as app } from 'client-common/store/index'
import { combineReducers } from 'redux'
import { exerciseSheetReducer as exerciseSheet } from '../page/exerciseSheet/exerciseSheetReducer'
import { exerciseFormReducer as exerciseEdit } from '../page/exerciseEdit/exerciseFormReducer'
import { wikiPageReducer as wikiPage } from '../page/wiki/wikiReducer'
import { resourcesReducer as resources } from '../page/resources/resourceReducer'

export default combineReducers<state.AdminRoot>({
  app,
  exerciseEdit,
  exerciseSheet,
  wikiPage,
  resources
})
