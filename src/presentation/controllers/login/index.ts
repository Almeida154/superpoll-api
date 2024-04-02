import { NoProvidedParamError } from '@/presentation/errors'
import { badRequest, internalServerError } from '@/presentation/helpers/http'

import { IController, IHttpResponse } from '@/presentation/protocols'

export class LoginController implements IController {
  async handle(): Promise<IHttpResponse> {
    try {
      return badRequest(new NoProvidedParamError('email'))
    } catch (error) {
      return internalServerError(error)
    }
  }
}
