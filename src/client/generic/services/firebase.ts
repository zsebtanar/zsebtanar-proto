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

type Params = Record<string, unknown>
type Options = { withToken: boolean }

export async function cloudFnRequest(
  method: 'get' | 'post' | 'delete',
  path: string,
  params?: Params,
  body?: unknown,
  options?: Options
) {
  const authHeader = options?.withToken ? await getTokenHeader() : {}

  const config = {
    method,
    path,
    body: JSON.stringify(body),
    params,
    headers: { ...authHeader, 'Content-Type': 'application/json' }
  }
  return fetch(`${__CONFIG__.api}${path}`, config)
}

export const cloudFnGet = <T>(path: string, params: Params, options?: Options) =>
  cloudFnRequest('get', path, params, undefined, options).then(res => res.json())

export const cloudFnPost = <T, R = T>(path: string, data: T, options?: Options): Promise<R> =>
  cloudFnRequest('post', path, undefined, data, options).then(res => res.json())

export const cloudFnDelete = (path: string, params: Params, options?: Options) =>
  cloudFnRequest('delete', path, params, undefined, options)
