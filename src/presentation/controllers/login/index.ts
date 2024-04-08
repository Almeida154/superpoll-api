import { IAuthenticationUseCase } from '@/domain/usecases'

import { IValidation } from '@/presentation/helpers/validators'

import {
  badRequest,
  internalException,
  ok,
  unauthorized,
} from '@/presentation/helpers/http/http'

import {
  IController,
  IHttpRequest,
  IHttpResponse,
} from '@/presentation/protocols'

export class LoginController implements IController {
  private readonly authentication: IAuthenticationUseCase
  private readonly validation: IValidation

  constructor(authentication: IAuthenticationUseCase, validation: IValidation) {
    this.authentication = authentication
    this.validation = validation
  }

  async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) return badRequest(error)

      const { email, password } = httpRequest.body

      const accessToken = await this.authentication.execute({ email, password })
      if (!accessToken) return unauthorized()

      return ok({ accessToken })
    } catch (error) {
      return internalException(error)
    }
  }
}
