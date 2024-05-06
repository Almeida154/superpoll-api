import { ILoadAccountByTokenUseCase } from '@/domain/usecases'
import { AccessDeniedError } from '@/presentation/errors'
import { forbidden } from '@/presentation/helpers/http'
import {
  IHttpRequest,
  IHttpResponse,
  IMiddleware,
} from '@/presentation/protocols'

export class AuthenticationMiddleware implements IMiddleware {
  constructor(
    private readonly loadAccountByTokenUseCase: ILoadAccountByTokenUseCase,
  ) {}

  async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const accessToken = httpRequest.headers?.['x-access-token']
    if (!accessToken) return forbidden(new AccessDeniedError())
    await this.loadAccountByTokenUseCase.execute(accessToken)
    return forbidden(new AccessDeniedError())
  }
}
