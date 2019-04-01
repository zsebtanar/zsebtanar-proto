import { DocRef } from 'client-common/services/fireStoreBase'
import { WikiPageModel, wikiPageService } from 'client-common/services/wikiPageService'
import { openConfirmModal } from 'client-common/store/actions/modal'
import { addNotification } from 'client-common/store/notifications'
import { assocPath, pipe, set } from 'ramda'
import { EXERCISE_ERROR } from '../exerciseEdit/exerciseFormReducer'
import { initResources, uploadResources } from '../resources/resourceReducer'

///

export const WIKI_PAGE_NEW = 'admin/WIKI_PAGE_NEW'
export const WIKI_PAGE_CLONE = 'admin/WIKI_PAGE_CLONE'
export const WIKI_PAGE_INIT = 'admin/WIKI_PAGE_INIT'
export const WIKI_PAGE_READY = 'admin/WIKI_PAGE_READY'
export const WIKI_PAGE_SAVE_START = 'admin/WIKI_PAGE_SAVE_START'
export const WIKI_PAGE_SAVED = 'admin/WIKI_PAGE_SAVED'
export const WIKI_PAGE_ERROR = 'admin/WIKI_PAGE_ERROR'
export const WIKI_PAGE_SET_FIELD = 'admin/WIKI_PAGE_SET_FIELD'

///

export function clearWikiPage() {
  return dispatch => {
    dispatch({ type: WIKI_PAGE_INIT })
  }
}

export function newWikiPage() {
  return dispatch => {
    dispatch({ type: WIKI_PAGE_INIT })
    dispatch({ type: WIKI_PAGE_NEW })
    dispatch({ type: WIKI_PAGE_READY, payload: NEW_LIST })
    dispatch(initResources({}))
  }
}

export function loadWikiPage(id) {
  return dispatch => {
    dispatch({ type: WIKI_PAGE_INIT })
    wikiPageService.get(id).then(
      data => {
        dispatch({ type: WIKI_PAGE_READY, payload: data })
        dispatch(initResources(data.resources || {}))
      },
      error => dispatch({ type: WIKI_PAGE_ERROR, payload: error })
    )
  }
}

export function saveWikiPage() {
  return dispatch =>
    dispatch(uploadResources('wiki'))
      .then(() => dispatch(storeWikiPage()))
      .catch(error => dispatch({ type: EXERCISE_ERROR, payload: error }))
}

function storeWikiPage() {
  return async (dispatch, getState: () => state.AdminRoot) => {
    const { wikiPage, resources } = getState()
    if (wikiPage.changed && !wikiPage.saving) {
      dispatch({ type: WIKI_PAGE_SAVE_START })
      const data = { ...wikiPage.data, resources: { ...resources.data } }

      try {
        const res: DocRef = await wikiPageService.store(data)

        if (!data.id) {
          window.location.replace(`/admin/wiki-page/edit/${res.id}`)
        } else {
          dispatch({ type: WIKI_PAGE_SAVED })
        }
        dispatch(addNotification('success', 'Wiki oldal elmentve.', { timeout: 3 }))
      } catch (error) {
        dispatch({ type: WIKI_PAGE_ERROR, payload: error })
      }
    }
  }
}

export function removeWikiPage() {
  return async (dispatch, getState: () => state.AdminRoot) => {
    const state = getState().wikiPage
    dispatch(
      openConfirmModal({
        content: `Biztos törlöd a(z) "${state.data.title}" Wiki oldalt?`,
        onSuccess: async () => {
          await wikiPageService.delete(state.data.id)
          window.location.replace(`/admin/wiki-page/`)
        }
      })
    )
  }
}

export function setWikiPageField(lens, value) {
  return {
    type: WIKI_PAGE_SET_FIELD,
    payload: { lens, value }
  }
}

///

const INIT_STATE: state.AdminWikPage = {
  loading: true,
  mode: 'update',
  changed: false,
  saving: false,
  data: undefined,
  error: undefined
}

const NEW_LIST: WikiPageModel = {
  title: 'Új Wiki oldal',
  content: '',
  resources: {}
}

///

export function wikiPageReducer(state = INIT_STATE, action): state.AdminWikPage {
  switch (action.type) {
    case WIKI_PAGE_INIT:
      return { ...INIT_STATE }

    case WIKI_PAGE_NEW:
      return { ...state, mode: 'new' }

    case WIKI_PAGE_CLONE:
      return { ...state, mode: 'clone' }

    case WIKI_PAGE_READY:
      return { ...state, loading: false, data: action.payload }

    case WIKI_PAGE_SAVE_START:
      return { ...state, saving: true }

    case WIKI_PAGE_SAVED:
      return { ...state, saving: false, changed: false }

    case WIKI_PAGE_ERROR:
      return { ...state, error: action.payload, loading: false, saving: false }

    case WIKI_PAGE_SET_FIELD: {
      const { lens, value } = action.payload
      return pipe(
        set(lens, value),
        assocPath(['changed'], true)
      )(state) as state.AdminWikPage
    }
    default:
      return state
  }
}
