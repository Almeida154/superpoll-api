import { HttpRequest, HttpResponse } from '@/presentation/protocols/http'
import { NoProvidedParamError } from '@/presentation/errors/no-provided-param'

export class SignUpController {
  handle(httpRequest: HttpRequest): HttpResponse {
    if (!httpRequest.body.name)
      return {
        statusCode: 400,
        body: new NoProvidedParamError('name'),
      }

    if (!httpRequest.body.email)
      return {
        statusCode: 400,
        body: new NoProvidedParamError('e-mail'),
      }
  }
}
