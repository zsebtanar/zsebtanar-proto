import { rootReducer as app } from 'client-common/store/index'
import { combineReducers } from 'redux'
import { exerciseSheetReducer as exerciseSheet } from '../page/exerciseSheet/exerciseSheetReducer'
import { exerciseFormReducer as exerciseEdit } from '../page/exerciseEdit/exerciseFormReducer'
import { wikiPageReducer as wikiPage } from '../../client/app-admin/pages/wiki/wikiReducer'
import { resourcesReducer as resources } from '../../client/file-upload/resources/resourceReducer'

export default combineReducers({
  app,
  exerciseEdit,
  exerciseSheet,
  wikiPage,
  resources
})
