export class SignUpController {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  handle(httpRequest: any): any {
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
