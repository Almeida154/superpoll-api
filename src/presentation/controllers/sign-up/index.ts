import {
  IHttpRequest,
  IHttpResponse,
  IController,
  IAddAccountUseCase,
} from './protocols'

import { badRequest, internalException, ok } from '@/presentation/helpers/http'
import { IValidation } from '@/presentation/helpers/validators'

export class SignUpController implements IController {
  private readonly addAccountUseCase: IAddAccountUseCase
  private readonly validation: IValidation

  constructor(addAccountUseCase: IAddAccountUseCase, validation: IValidation) {
    this.addAccountUseCase = addAccountUseCase
    this.validation = validation
  }

  async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) return badRequest(error)

      const { password, email, name } = httpRequest.body

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
