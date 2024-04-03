import { InvalidParamError, NoProvidedParamError } from '@/presentation/errors'
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
      const { email, password } = httpRequest.body

      if (!email) return badRequest(new NoProvidedParamError('email'))
      if (!password) return badRequest(new NoProvidedParamError('password'))

      const isEmailValid = this.emailValidator.isValid(email)

      if (!isEmailValid) return badRequest(new InvalidParamError('email'))
    } catch (error) {
      return internalServerError(error)
    }
  }
}
