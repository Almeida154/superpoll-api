import {
  HttpRequest,
  HttpResponse,
  Controller,
  AddAccountUseCase,
  EmailValidator,
} from './protocols'

import { NoProvidedParamError, InvalidParamError } from '@/presentation/errors'

import {
  badRequest,
  internalServerError,
  ok,
} from '@/presentation/helpers/http'

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly addAccountUseCase: AddAccountUseCase

  constructor(
    emailValidator: EmailValidator,
    addAccountUseCase: AddAccountUseCase,
  ) {
    this.emailValidator = emailValidator
    this.addAccountUseCase = addAccountUseCase
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
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
