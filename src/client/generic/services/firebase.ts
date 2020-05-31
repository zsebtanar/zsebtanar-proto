import { app } from 'client/generic/services/fireApp'

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
    method,
    path,
    data,
    params,
    headers: { ...authHeader }
  }
  return fetch(`${__CONFIG__.api}/${path}`, config)
}

export const cloudFnGet = (path, params, options?) =>
  cloudFnRequest('get', path, params, undefined, options)

export const cloudFnPost = (path, data, options?) =>
  cloudFnRequest('post', path, undefined, data, options)

export const cloudFnDelete = (path, params, options?) =>
  cloudFnRequest('delete', path, params, undefined, options)
