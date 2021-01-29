import * as https from 'https'

export function simpleGet(url): Promise<string> {
  return new Promise((res, rej) => {
    https
      .get(url, resp => {
        let data = ''

        resp.on('data', chunk => (data += chunk))

        resp.on('end', () => res(data))
      })
      .on('error', err => rej(err))
  })
}
