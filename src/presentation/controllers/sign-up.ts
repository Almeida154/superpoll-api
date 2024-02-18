import { HttpRequest, HttpResponse } from '@/presentation/protocols/http'
import { badRequest } from '@/presentation/helpers/http'
import { NoProvidedParamError } from '@/presentation/errors/no-provided-param'

export class SignUpController {
  handle(httpRequest: HttpRequest): HttpResponse {
    if (!httpRequest.body.name)
      return badRequest(new NoProvidedParamError('name'))

    if (!httpRequest.body.email)
      return badRequest(new NoProvidedParamError('e-mail'))
  }
}
