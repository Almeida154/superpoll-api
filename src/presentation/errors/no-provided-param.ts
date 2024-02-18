export class NoProvidedParamError extends Error {
  constructor(paramName: string) {
    super(`No ${paramName} was provided.`)
    this.name = 'NoProvidedParamError'
  }
}
