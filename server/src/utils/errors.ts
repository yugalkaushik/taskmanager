export class AppError extends Error {
  statusCode: number

  constructor(message: string, statusCode: number) {
    super(message)
    this.statusCode = statusCode
    Object.setPrototypeOf(this, AppError.prototype)
  }
}

export const notFound = (message = 'Not found') => new AppError(message, 404)
export const unauthorized = (message = 'Unauthorized') => new AppError(message, 401)
export const forbidden = (message = 'Forbidden') => new AppError(message, 403)
export const badRequest = (message = 'Bad request') => new AppError(message, 400)
export const conflict = (message = 'Conflict') => new AppError(message, 409)