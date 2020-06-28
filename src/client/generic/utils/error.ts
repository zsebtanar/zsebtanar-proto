export class CustomError {
  private readonly _message: string
  constructor(message = 'error') {
    this._message = message
  }

  get message() {
    return this._message
  }
}

export class NotFoundError extends CustomError {}

export function errorToString(error: any, codeMapping: Record<string, string>) {
  if (error.code && codeMapping?.[error.code]) {
    return codeMapping?.[error.code]
  }
  if (error.message) {
    return error.message
  }
  return JSON.stringify(error)
}
