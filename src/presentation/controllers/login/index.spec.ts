import { describe, expect, it, vi } from 'vitest'

import { IHttpRequest } from '@/presentation/protocols'

import {
  badRequest,
  internalException,
  ok,
  unauthorized,
} from '@/presentation/helpers/http'

import { NoProvidedParamError } from '@/presentation/errors'
import { IAuthentication } from '@/domain/usecases'
import { IValidation } from '@/presentation/helpers/validators'

import { LoginController } from '.'

const makeFakeRequest = (): IHttpRequest => ({
  body: {
    email: 'any@email',
    password: 'any_password',
  },
})

const makeAuthentication = (): IAuthentication => {
  class AuthenticationStub implements IAuthentication {
    async auth(): Promise<string> {
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
  authenticationStub: IAuthentication
  validationStub: IValidation
}

const makeSUT = (): ISut => {
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

  it('should return 200 if valid credentials are provided', async () => {
    const { sut } = makeSUT()
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(ok({ accessToken: 'any_token' }))
  })

  it('should call Validation with correct value', async () => {
    const { sut, validationStub } = makeSUT()
    const validateSpy = vi.spyOn(validationStub, 'validate')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  it('should return 400 if Validation returns an error', async () => {
    const { sut, validationStub } = makeSUT()
    vi.spyOn(validationStub, 'validate').mockReturnValueOnce(
      new NoProvidedParamError('any_field'),
    )
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(
      badRequest(new NoProvidedParamError('any_field')),
    )
  })
})
