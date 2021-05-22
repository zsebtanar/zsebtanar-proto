import { auth } from 'client/generic/services/fireApp'

const getTokenHeader = async (optional = false): Promise<{ Authorization: string }> => {
  const user = auth.currentUser
  if (user) {
    const token = await user.getIdToken()
    return { Authorization: `Bearer ${token}` }
  } else {
    if (optional) {
      return {} as any
    } else {
      return Promise.reject('No user')
    }
  }
}

type Params = Record<string, unknown>
type Options = { withToken: boolean }

export async function cloudFnRequest(
  method: 'get' | 'post' | 'delete',
  path: string,
  params?: Params,
  body?: unknown,
  options?: Options,
): Promise<Response> {
  const authHeader = options?.withToken ? await getTokenHeader(true) : {}

  const config = {
    method,
    path,
    body: JSON.stringify(body),
    params,
    headers: { ...authHeader, 'Content-Type': 'application/json' },
  }
  return fetch(`${__CONFIG__.api}${path}`, config)
}

export const cloudFnGet = <T>(path: string, params?: Params, options?: Options): Promise<T> =>
  cloudFnRequest('get', path, params, undefined, options).then(processResponse)

export const cloudFnPost = <T, R = T>(path: string, data: T, options?: Options): Promise<R> =>
  cloudFnRequest('post', path, undefined, data, options).then(processResponse)

export const cloudFnDelete = (path: string, params: Params, options?: Options): Promise<void> =>
  cloudFnRequest('delete', path, params, undefined, options).then(processResponse)

async function processResponse(res: Response) {
  if (res.status >= 200 && res.status < 300) {
    return (res.status === 204 || (await res.json())) ?? true
  } else {
    throw {
      status: res.status,
      details: await getJSONResponse(res),
    }
  }
}

async function getJSONResponse(res: Response) {
  try {
    return await res.json()
  } catch {
    return {}
  }
}
