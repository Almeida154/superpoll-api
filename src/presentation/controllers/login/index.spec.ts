import { describe, expect, it, vi } from 'vitest'

import { IHttpRequest } from '@/presentation/protocols'

import {
  badRequest,
  internalException,
  ok,
  unauthorized,
} from '@/presentation/helpers/http/http'

import { NoProvidedParamError } from '@/presentation/errors'
import { IAuthenticationUseCase } from '@/domain/usecases'
import { IValidation } from '@/presentation/helpers/validators'

import { LoginController } from '.'

const makeFakeRequest = (): IHttpRequest => ({
  body: {
    email: 'any@email',
    password: 'any_password',
  },
})

const makeAuthentication = (): IAuthenticationUseCase => {
  class AuthenticationStub implements IAuthenticationUseCase {
    async execute(): Promise<string> {
      return new Promise((resolve) => resolve('any_token'))
    }
  }

  return new AuthenticationStub()
}

const makeValidation = (): IValidation => {
  class ValidationStub implements IValidation {
    validate(): Error {
      return null
    }
  }

  return new ValidationStub()
}

interface ISut {
  sut: LoginController
  authenticationStub: IAuthenticationUseCase
  validationStub: IValidation
}

const makeSut = (): ISut => {
  const authenticationStub = makeAuthentication()
  const validationStub = makeValidation()

  const sut = new LoginController(authenticationStub, validationStub)

  return {
    sut,
    authenticationStub,
    validationStub,
  }
}

describe('LoginController', () => {
  it('should call Authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSut()
    const authSpy = vi.spyOn(authenticationStub, 'execute')
    await sut.handle(makeFakeRequest())
    expect(authSpy).toHaveBeenCalledWith({
      email: 'any@email',
      password: 'any_password',
    })
  })

  it('should return 401 if Authentication fails', async () => {
    const { sut, authenticationStub } = makeSut()
    vi.spyOn(authenticationStub, 'execute').mockReturnValueOnce(
      new Promise((resolve) => resolve(null)),
    )
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(unauthorized())
  })

  it('should return 500 if Authentication throws', async () => {
    const { sut, authenticationStub } = makeSut()
    vi.spyOn(authenticationStub, 'execute').mockReturnValueOnce(
      new Promise((resolve, reject) => reject(new Error())),
    )
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(internalException(new Error()))
  })

  it('should return 200 if valid credentials are provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(ok({ accessToken: 'any_token' }))
  })

  it('should call Validation with correct value', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = vi.spyOn(validationStub, 'validate')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  it('should return 400 if Validation returns an error', async () => {
    const { sut, validationStub } = makeSut()
    vi.spyOn(validationStub, 'validate').mockReturnValueOnce(
      new NoProvidedParamError('any_field'),
    )
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(
      badRequest(new NoProvidedParamError('any_field')),
    )
  })
})
