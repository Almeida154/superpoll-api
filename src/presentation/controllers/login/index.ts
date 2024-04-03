import { NoProvidedParamError } from '@/presentation/errors'
import { badRequest, internalServerError } from '@/presentation/helpers/http'

import {
  IController,
  IHttpRequest,
  IHttpResponse,
} from '@/presentation/protocols'

export class LoginController implements IController {
  async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      if (!httpRequest.body.email)
        return badRequest(new NoProvidedParamError('email'))

      if (!httpRequest.body.password)
        return badRequest(new NoProvidedParamError('password'))
    } catch (error) {
      return internalServerError(error)
    }
  }
}
