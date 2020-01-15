import axios from 'axios'
import { app } from 'client-common/fireApp'

export function resolveSnapshot(snapshot) {
  return snapshot.val()
}

const getTokenHeader = async (): Promise<{ Authorization: string }> => {
  const user = app.auth().currentUser
  if (user) {
    const token = await user.getIdToken()
    return { Authorization: `Bearer ${token}` }
  } else {
    return Promise.reject('No user')
  }
}

export async function cloudFnRequest(
  method: 'get' | 'post' | 'delete',
  path: string,
  params?: { [key: string]: unknown },
  data?: unknown,
  options?: { withToken: boolean }
) {
  const authHeader = options?.withToken ? await getTokenHeader() : {}

  const config = {
    baseURL: `${__CONFIG__.api}/${path}`,
    method,
    path,
    data,
    params,
    headers: { ...authHeader }
  }
  return axios(config)
}

export const cloudFnGet = (path, params, options?) =>
  cloudFnRequest('get', path, params, undefined, options)

export const cloudFnPost = (path, data, options?) =>
  cloudFnRequest('post', path, undefined, data, options)

export const cloudFnDelete = (path, params, options?) =>
  cloudFnRequest('delete', path, params, undefined, options)
