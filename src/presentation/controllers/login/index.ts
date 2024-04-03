import { IAuthentication } from '@/domain/usecases'
import { InvalidParamError, NoProvidedParamError } from '@/presentation/errors'
import {
  badRequest,
  internalException,
  unauthorized,
} from '@/presentation/helpers/http'

import {
  IController,
  IEmailValidator,
  IHttpRequest,
  IHttpResponse,
} from '@/presentation/protocols'

export class LoginController implements IController {
  private readonly emailValidator: IEmailValidator
  private readonly authentication: IAuthentication

  constructor(
    emailValidator: IEmailValidator,
    authentication: IAuthentication,
  ) {
    this.emailValidator = emailValidator
    this.authentication = authentication
  }

  async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const requiredFields = ['email', 'password']

      for (const field of requiredFields) {
        if (!httpRequest.body[field])
          return badRequest(new NoProvidedParamError(field))
      }

      const { email, password } = httpRequest.body

      const isEmailValid = this.emailValidator.isValid(email)

      if (!isEmailValid) return badRequest(new InvalidParamError('email'))

      const token = await this.authentication.auth(email, password)

      if (!token) return unauthorized()
    } catch (error) {
      return internalException(error)
    }
  }
}
