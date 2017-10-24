import axios from 'axios'

export function resolveSnapshot(snapshot) {
  return snapshot.val()
}

export const cloudFnRequest = (method, path, params, data) =>
  axios({
    baseURL: `${__FN_PATH__}/${path}`,
    method,
    path,
    data,
    params,
    withCredentials: true
  })

export const cloudFnGet = (path, params) => cloudFnRequest('get', path, params)
export const cloudFnPost = (path, data) => cloudFnRequest('post', path, undefined, data)
export const cloudFnDelete = (path, params) => cloudFnRequest('delete', path, params)
