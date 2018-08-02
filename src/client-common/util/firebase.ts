import axios from 'axios'
import { merge } from 'ramda'
import { fireApp } from '../fireApp'

export function resolveSnapshot(snapshot) {
  return snapshot.val()
}

const getTokenHeader = (): Promise<any> =>
  fireApp
    .auth()
    .currentUser.getIdToken()
    .then(token => ({ headers: { Authorization: `Bearer ${token}` } }))

export const cloudFnRequest = (method, path, params, data, options) => {
  const opt = Object.assign({}, options)

  return Promise.resolve({
    baseURL: `${__FN_PATH__}/${path}`,
    method,
    path,
    data,
    params
  })
    .then(config => (opt.withToken ? getTokenHeader().then(merge(config)) : config))
    .then(axios)
}

export const cloudFnGet = (path, params, options?) =>
  cloudFnRequest('get', path, params, undefined, options)

export const cloudFnPost = (path, data, options?) =>
  cloudFnRequest('post', path, undefined, data, options)

export const cloudFnDelete = (path, params, options?) =>
  cloudFnRequest('delete', path, params, undefined, options)
