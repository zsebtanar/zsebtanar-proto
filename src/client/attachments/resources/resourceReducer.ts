// /*
//
// import { assocPath, keys, pickBy } from 'ramda'
// import { MarkdownResources } from 'client/markdown/types'
// import { uid } from 'client/generic/utils'
// import { openFileUpload } from 'X-client-common/store/actions/modal'
//
// ///
//
// export const RESOURCES_INIT = 'admin/RESOURCES_INIT'
// export const RESOURCES_ADD = 'admin/RESOURCES_ADD'
// export const RESOURCES_CLEAN = 'admin/RESOURCES_CLEAN'
// export const RESOURCES_UPLOADED = 'admin/RESOURCES_UPLOADED'
// export const RESOURCES_ERROR = 'admin/RESOURCES_ERROR'
//
// ///
//
// const isNew = val => val.isNew
//
// ///
//
// export function initResources(resources: MarkdownResources) {
//   return {
//     type: RESOURCES_INIT,
//     payload: resources
//   }
// }
//
// export function addResource(file) {
//   const id = uid()
//   return dispatch => {
//     const reader = new FileReader()
//
//     reader.addEventListener(
//       'load',
//       () =>
//         dispatch({
//           type: RESOURCES_ADD,
//           payload: { id, file, url: reader.result }
//         }),
//       false
//     )
//     reader.readAsDataURL(file)
//   }
// }
//
// export function uploadResources(folder: string) {
//   return (dispatch, getState) => {
//     return new Promise((resolve, reject) => {
//       const res = getState().resources.data
//       const newResList = pickBy(isNew, res)
//
//       if (keys(newResList).length) {
//         dispatch(
//           openFileUpload({
//             folder,
//             resources: newResList as any,
//             onSuccess: res => resolve(dispatch({ type: RESOURCES_UPLOADED, payload: res })),
//             onError: error => reject(dispatch({ type: RESOURCES_ERROR, payload: error }))
//           })
//         )
//       } else {
//         resolve(dispatch({ type: RESOURCES_UPLOADED, payload: {} }))
//       }
//     })
//   }
// }
//
// ///
//
// const INIT_STATE = {
//   data: undefined,
//   error: undefined
// }
//
// export function resourcesReducer(state = INIT_STATE, action) {
//   switch (action.type) {
//     case RESOURCES_INIT:
//       return { ...INIT_STATE, data: action.payload }
//     case RESOURCES_ADD:
//       return assocPath(['data', action.payload.id], {
//         isNew: true,
//         url: action.payload.url,
//         type: action.payload.file.type,
//         name: action.payload.file.name,
//         file: action.payload.file
//       })(state)
//     case RESOURCES_UPLOADED:
//       return { ...state, data: { ...state.data, ...action.payload } }
//     case RESOURCES_CLEAN:
//       return { ...INIT_STATE }
//     case RESOURCES_ERROR:
//       return { ...state, error: action.payload}
//     default:
//       return state
//   }
// }
// */
