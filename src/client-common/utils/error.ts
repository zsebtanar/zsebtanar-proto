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
