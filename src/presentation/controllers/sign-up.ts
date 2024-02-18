import { HttpRequest, HttpResponse } from '@/presentation/protocols/http'
import { badRequest } from '@/presentation/helpers/http'
import { NoProvidedParamError } from '@/presentation/errors/no-provided-param'

export class SignUpController {
  handle(httpRequest: HttpRequest): HttpResponse {
    const requiredFields = ['name', 'email', 'password']

    for (const field of requiredFields) {
      if (!httpRequest.body[field])
        return badRequest(new NoProvidedParamError(field))
    }
  }
}
