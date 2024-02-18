export class SignUpController {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  handle(httpRequest: any) {
    return {
      statusCode: 400,
      body: new Error('No name was provided'),
    }
  }
}
