import { IAuthenticationUseCase } from '@/domain/usecases'

import {
  IValidation,
  IController,
  IHttpRequest,
  IHttpResponse,
} from '@/presentation/protocols'

import {
  badRequest,
  internalException,
  ok,
  unauthorized,
} from '@/presentation/helpers/http'

export class SignInController implements IController {
  constructor(
    private readonly authentication: IAuthenticationUseCase,
    private readonly validation: IValidation,
  ) {}

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
