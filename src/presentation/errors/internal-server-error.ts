export class InternalServerError extends Error {
  constructor(stack: string) {
    super('There was an error during the request')
    this.name = 'InternalServerError'
    this.stack = stack
  }
}
