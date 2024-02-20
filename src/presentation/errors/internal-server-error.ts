export class InternalServerError extends Error {
  constructor() {
    super('There was an error during the request')
    this.name = 'InternalServerError'
  }
}
