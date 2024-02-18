import { HttpRequest, HttpResponse } from '../protocols/http'

export class SignUpController {
  handle(httpRequest: HttpRequest): HttpResponse {
    if (!httpRequest.body.name)
      return {
        statusCode: 400,
        body: new Error('No name was provided'),
      }

    if (!httpRequest.body.email)
      return {
        statusCode: 400,
        body: new Error('No e-mail was provided'),
      }
  }
}
