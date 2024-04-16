import { describe, expect, it, vi, vitest } from 'vitest'

import {
  NoProvidedParamError,
  InternalServerError,
} from '@/presentation/errors'

import {
  ok,
  internalException,
  badRequest,
  unauthorized,
} from '@/presentation/helpers/http/http'

import { IValidation } from '@/presentation/helpers/validators'
import { IAuthenticationUseCase } from '@/domain/usecases'

import { AccountModel, IAddAccountUseCase, IHttpRequest } from './protocols'

import { SignUpController } from '.'

const makeAddAccountUseCase = (): IAddAccountUseCase => {
  class AddAccountStub implements IAddAccountUseCase {
    async execute(): Promise<AccountModel> {
      return new Promise((resolve) => resolve(makeFakeAccount()))
    }
  }

  return new AddAccountStub()
}

const makeValidation = (): IValidation => {
  class ValidationStub implements IValidation {
    validate(): Error {
      return null
    }
  }

  return new ValidationStub()
}

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'any_name',
  email: 'any@mail.com',
  password: 'any_password',
})

const makeFakeRequest = (): IHttpRequest => ({
  body: {
    name: 'any_name',
    email: 'any@mail.com',
    password: 'any_password',
    passwordConfirmation: 'any_password',
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

interface ISut {
  addAccountUseCaseStub: IAddAccountUseCase
  validationStub: IValidation
  authenticationStub: IAuthenticationUseCase
  sut: SignUpController
}

const makeSut = (): ISut => {
  const addAccountUseCaseStub = makeAddAccountUseCase()
  const validationStub = makeValidation()
  const authenticationStub = makeAuthentication()
  const sut = new SignUpController(
    addAccountUseCaseStub,
    authenticationStub,
    validationStub,
  )

  return { addAccountUseCaseStub, validationStub, authenticationStub, sut }
}

describe('SignUp Controller', () => {
  it('should call AddAccountUseCase with correct values', async () => {
    const { sut, addAccountUseCaseStub } = makeSut()

    const addSpy = vitest.spyOn(addAccountUseCaseStub, 'execute')

    await sut.handle(makeFakeRequest())

    expect(addSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any@mail.com',
      password: 'any_password',
    })
  })

  it('should return 500 if AddAccountUseCase throws', async () => {
    const { sut, addAccountUseCaseStub } = makeSut()

    vitest
      .spyOn(addAccountUseCaseStub, 'execute')
      .mockImplementationOnce(async () => {
        return new Promise((resolve, reject) => reject(new Error()))
      })

    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(
      internalException(new InternalServerError(null)),
    )
  })

  it('should return 200 if valid data is provided', async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(ok({ accessToken: 'any_token' }))
  })

  it('should call Validation with correct value', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = vitest.spyOn(validationStub, 'validate')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  it('should call Authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSut()
    const authSpy = vi.spyOn(authenticationStub, 'execute')
    await sut.handle(makeFakeRequest())
    expect(authSpy).toHaveBeenCalledWith({
      email: 'any@mail.com',
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
