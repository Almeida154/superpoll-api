import {
  IHttpRequest,
  IHttpResponse,
  IController,
  IAddAccountUseCase,
  IEmailValidator,
} from './protocols'

import { InvalidParamError } from '@/presentation/errors'
import { badRequest, internalException, ok } from '@/presentation/helpers/http'
import { IValidation } from '@/presentation/helpers/validators'

export class SignUpController implements IController {
  private readonly emailValidator: IEmailValidator
  private readonly addAccountUseCase: IAddAccountUseCase
  private readonly validation: IValidation

  constructor(
    emailValidator: IEmailValidator,
    addAccountUseCase: IAddAccountUseCase,
    validation: IValidation,
  ) {
    this.emailValidator = emailValidator
    this.addAccountUseCase = addAccountUseCase
    this.validation = validation
  }

  async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) return badRequest(error)

      const { password, email, name } = httpRequest.body

      const isEmailValid = this.emailValidator.isValid(email)

      if (!isEmailValid) return badRequest(new InvalidParamError('email'))

      const account = await this.addAccountUseCase.execute({
        email,
        password,
        name,
      })

      return ok(account)
    } catch (error) {
      return internalException(error)
    }
  }
}
