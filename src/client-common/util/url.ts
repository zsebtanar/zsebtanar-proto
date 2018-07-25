export function getQueryParams(queryString: string, param: string): string {
  const vars = queryString.substr(1).split('&')
  for (let i = 0; i < vars.length; i++) {
    const [key, value] = vars[i].split('=')
    if (decodeURIComponent(key) === param) {
      return decodeURIComponent(value)
    }
  }
}
