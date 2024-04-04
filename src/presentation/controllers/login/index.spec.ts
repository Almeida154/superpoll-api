import { describe, expect, it, vi } from 'vitest'

import { IEmailValidator, IHttpRequest } from '@/presentation/protocols'

import {
  badRequest,
  internalException,
  unauthorized,
} from '@/presentation/helpers/http'

import { InvalidParamError, NoProvidedParamError } from '@/presentation/errors'

import { IAuthentication } from '@/domain/usecases'

import { LoginController } from '.'

const makeFakeRequest = (): IHttpRequest => ({
  body: {
    email: 'any@email',
    password: 'any_password',
  },
})

const makeEmailValidator = (): IEmailValidator => {
  class EmailValidatorStub implements IEmailValidator {
    isValid(): boolean {
      return true
    }
  }

  return new EmailValidatorStub()
}

const makeAuthentication = (): IAuthentication => {
  class AuthenticationStub implements IAuthentication {
    async auth(): Promise<string> {
      return new Promise((resolve) => resolve('any_token'))
    }
  }

  return new AuthenticationStub()
}

interface ISut {
  sut: LoginController
  emailValidatorStub: IEmailValidator
  authenticationStub: IAuthentication
}

const makeSUT = (): ISut => {
  const emailValidatorStub = makeEmailValidator()
  const authenticationStub = makeAuthentication()
  const sut = new LoginController(emailValidatorStub, authenticationStub)

  return {
    sut,
    emailValidatorStub,
    authenticationStub,
  }
}

describe('LoginController', () => {
  it('should return 400 if no email is provided', async () => {
    const { sut } = makeSUT()
    const httpRequest: IHttpRequest = { body: { password: 'any_password' } }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new NoProvidedParamError('email')))
  })

  it('should return 400 if no password is provided', async () => {
    const { sut } = makeSUT()
    const httpRequest: IHttpRequest = { body: { email: 'any@email' } }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(
      badRequest(new NoProvidedParamError('password')),
    )
  })

  it('should call EmailValidator with correct email', async () => {
    const { sut, emailValidatorStub } = makeSUT()
    const isValidSpy = vi.spyOn(emailValidatorStub, 'isValid')
    await sut.handle(makeFakeRequest())
    expect(isValidSpy).toHaveBeenCalledWith('any@email')
  })

  it('should return 400 if an invalid email is provided', async () => {
    const { sut, emailValidatorStub } = makeSUT()
    vi.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')))
  })

  it('should return 500 if EmailValidator throws', async () => {
    const { sut, emailValidatorStub } = makeSUT()
    vi.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(internalException(new Error()))
  })

  it('should call Authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSUT()
    const authSpy = vi.spyOn(authenticationStub, 'auth')
    await sut.handle(makeFakeRequest())
    expect(authSpy).toHaveBeenCalledWith('any@email', 'any_password')
  })

  it('should return 401 if Authentication fails', async () => {
    const { sut, authenticationStub } = makeSUT()
    vi.spyOn(authenticationStub, 'auth').mockReturnValueOnce(
      new Promise((resolve) => resolve(null)),
    )
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(unauthorized())
  })

  it('should return 500 if Authentication throws', async () => {
    const { sut, authenticationStub } = makeSUT()
    vi.spyOn(authenticationStub, 'auth').mockReturnValueOnce(
      new Promise((resolve, reject) => reject(new Error())),
    )
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(internalException(new Error()))
  })

  it('should return 404 if user not found', () => null)

  it('should return 200 on success', () => null)
})
