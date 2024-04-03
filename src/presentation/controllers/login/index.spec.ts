import { describe, expect, it, vi } from 'vitest'

import { IEmailValidator, IHttpRequest } from '@/presentation/protocols'
import { badRequest } from '@/presentation/helpers/http'
import { NoProvidedParamError } from '@/presentation/errors'

import { LoginController } from '.'

interface ISut {
  sut: LoginController
  emailValidatorStub: IEmailValidator
}

const makeEmailValidator = (): IEmailValidator => {
  class EmailValidatorStub implements IEmailValidator {
    isValid(): boolean {
      return true
    }
  }

  return new EmailValidatorStub()
}

const makeSUT = (): ISut => {
  const emailValidatorStub = makeEmailValidator()
  const sut = new LoginController(emailValidatorStub)

  return {
    sut,
    emailValidatorStub,
  }
}

describe('LoginController', () => {
  it('should return 400 if no email is provided', async () => {
    const { sut } = makeSUT()
    const httpRequest: IHttpRequest = {
      body: {
        password: 'any_password',
      },
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new NoProvidedParamError('email')))
  })

  it('should return 400 if no password is provided', async () => {
    const { sut } = makeSUT()
    const httpRequest: IHttpRequest = {
      body: {
        email: 'any@email',
      },
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(
      badRequest(new NoProvidedParamError('password')),
    )
  })

  it('should call EmailValidator with correct email', async () => {
    const { sut, emailValidatorStub } = makeSUT()
    const isValidSpy = vi.spyOn(emailValidatorStub, 'isValid')
    const httpRequest: IHttpRequest = {
      body: {
        email: 'any@email',
        password: 'any_password',
      },
    }
    await sut.handle(httpRequest)
    expect(isValidSpy).toHaveBeenCalledWith('any@email')
  })

  it('should return 404 if user not found', () => null)

  it('should return 200 on success', () => null)
})
