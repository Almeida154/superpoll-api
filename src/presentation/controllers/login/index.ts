import { NoProvidedParamError } from '@/presentation/errors'
import { badRequest, internalServerError } from '@/presentation/helpers/http'

import {
  IController,
  IEmailValidator,
  IHttpRequest,
  IHttpResponse,
} from '@/presentation/protocols'

export class LoginController implements IController {
  private readonly emailValidator: IEmailValidator

  constructor(emailValidator: IEmailValidator) {
    this.emailValidator = emailValidator
  }

  async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      if (!httpRequest.body.email)
        return badRequest(new NoProvidedParamError('email'))

      if (!httpRequest.body.password)
        return badRequest(new NoProvidedParamError('password'))

      this.emailValidator.isValid(httpRequest.body.email)
    } catch (error) {
      return internalServerError(error)
    }
  }
}
