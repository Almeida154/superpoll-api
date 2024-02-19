import { HttpRequest, HttpResponse } from '@/presentation/protocols/http'
import { Controller } from '@/presentation/protocols/controller'
import { EmailValidator } from '@/presentation/protocols/email-validator'

import { NoProvidedParamError } from '@/presentation/errors/no-provided-param'
import { InvalidParamError } from '@/presentation/errors/invalid-param'

import { badRequest } from '@/presentation/helpers/http'

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator

  constructor(emailValidator: EmailValidator) {
    this.emailValidator = emailValidator
  }

  handle(httpRequest: HttpRequest): HttpResponse {
    const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']

    for (const field of requiredFields) {
      if (!httpRequest.body[field])
        return badRequest(new NoProvidedParamError(field))
    }

    const isEmailValid = this.emailValidator.isValid(httpRequest.body.email)

    if (!isEmailValid) return badRequest(new InvalidParamError('email'))
  }
}
