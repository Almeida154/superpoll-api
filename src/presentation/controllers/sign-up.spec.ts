import { describe, expect, test, vitest } from 'vitest'
import { SignUpController } from '@/presentation/controllers/sign-up'

import { NoProvidedParamError } from '@/presentation/errors/no-provided-param'
import { InvalidParamError } from '@/presentation/errors/invalid-param'

import { EmailValidator } from '@/presentation/protocols/email-validator'

interface ISut {
  emailValidatorStub: EmailValidator
  sut: SignUpController
}

const makeSUT = (): ISut => {
  class EmailValidatorStub implements EmailValidator {
    isValid(): boolean {
      return true
    }
  }

  const emailValidatorStub = new EmailValidatorStub()
  const sut = new SignUpController(emailValidatorStub)

  return { emailValidatorStub, sut }
}

describe('SignUp Controller', () => {
  test('Should return 400 if no name was provided', () => {
    const { sut } = makeSUT()

    const httpRequest = {
      body: {
        email: 'john@doe.com',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    }

    const httpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new NoProvidedParamError('name'))
  })

  test('Should return 400 if no email was provided', () => {
    const { sut } = makeSUT()

    const httpRequest = {
      body: {
        name: 'John Doe',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    }

    const httpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new NoProvidedParamError('email'))
  })

  test('Should return 400 if no password was provided', () => {
    const { sut } = makeSUT()

    const httpRequest = {
      body: {
        name: 'John Doe',
        email: 'john@doe.com',
        passwordConfirmation: 'any_password',
      },
    }

    const httpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new NoProvidedParamError('password'))
  })

  test('Should return 400 if no password confirmation was provided', () => {
    const { sut } = makeSUT()

    const httpRequest = {
      body: {
        name: 'John Doe',
        email: 'john@doe.com',
        password: 'any_password',
      },
    }

    const httpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(
      new NoProvidedParamError('passwordConfirmation'),
    )
  })

  test('Should return 400 if an invalid email was provided', () => {
    const { sut, emailValidatorStub } = makeSUT()

    vitest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)

    const httpRequest = {
      body: {
        name: 'John Doe',
        email: 'invalid@email.com',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    }

    const httpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('email'))
  })
})
