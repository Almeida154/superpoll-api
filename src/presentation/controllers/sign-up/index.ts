import { IAuthenticationUseCase } from '@/domain/usecases'

import {
  IHttpRequest,
  IHttpResponse,
  IController,
  IAddAccountUseCase,
} from './protocols'

import {
  badRequest,
  internalException,
  ok,
  unauthorized,
} from '@/presentation/helpers/http/http'

import { IValidation } from '@/presentation/helpers/validators'

export class SignUpController implements IController {
  constructor(
    private readonly addAccountUseCase: IAddAccountUseCase,
    private readonly authentication: IAuthenticationUseCase,
    private readonly validation: IValidation,
  ) {}

  async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) return badRequest(error)

      const { password, email, name } = httpRequest.body

      await this.addAccountUseCase.execute({
        email,
        password,
        name,
      })

      const accessToken = await this.authentication.execute({ email, password })
      if (!accessToken) return unauthorized()

      return ok({ accessToken })
    } catch (error) {
      return internalException(error)
    }
  }
}
