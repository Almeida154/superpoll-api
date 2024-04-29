import { AccessDeniedError } from '@/presentation/errors'
import { forbidden } from '@/presentation/helpers/http'
import {
  IHttpRequest,
  IHttpResponse,
  IMiddleware,
} from '@/presentation/protocols'

export class AuthenticationMiddleware implements IMiddleware {
  async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    if (!httpRequest.headers?.['x-access-token'])
      return forbidden(new AccessDeniedError())

    return null
  }
}
