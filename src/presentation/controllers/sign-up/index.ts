import {
  IHttpRequest,
  IHttpResponse,
  IController,
  IAddAccountUseCase,
  IEmailValidator,
} from './protocols'

import { NoProvidedParamError, InvalidParamError } from '@/presentation/errors'

import {
  badRequest,
  internalServerError,
  ok,
} from '@/presentation/helpers/http'

export class SignUpController implements IController {
  private readonly emailValidator: IEmailValidator
  private readonly addAccountUseCase: IAddAccountUseCase

  constructor(
    emailValidator: IEmailValidator,
    addAccountUseCase: IAddAccountUseCase,
  ) {
    this.emailValidator = emailValidator
    this.addAccountUseCase = addAccountUseCase
  }

  async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const requiredFields = [
        'name',
        'email',
        'password',
        'passwordConfirmation',
      ]

      for (const field of requiredFields) {
        if (!httpRequest.body[field])
          return badRequest(new NoProvidedParamError(field))
      }

      const { password, passwordConfirmation, email, name } = httpRequest.body

      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamError('passwordConfirmation'))
      }

      const isEmailValid = this.emailValidator.isValid(email)

      if (!isEmailValid) return badRequest(new InvalidParamError('email'))

      const account = await this.addAccountUseCase.execute({
        email,
        password,
        name,
      })

      return ok(account)
    } catch (error) {
      return internalServerError()
    }
  }
}
