import { describe, expect, it, vi, vitest } from 'vitest'

import { SignUpController } from '.'

import {
  NoProvidedParamError,
  InternalServerError,
} from '@/presentation/errors'

import {
  ok,
  internalException,
  badRequest,
} from '@/presentation/helpers/http/http'

import { AccountModel, IAddAccountUseCase, IHttpRequest } from './protocols'

import { IValidation } from '@/presentation/helpers/validators'

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

interface ISut {
  addAccountUseCaseStub: IAddAccountUseCase
  validationStub: IValidation
  sut: SignUpController
}

const makeSut = (): ISut => {
  const addAccountUseCaseStub = makeAddAccountUseCase()
  const validationStub = makeValidation()
  const sut = new SignUpController(addAccountUseCaseStub, validationStub)

  return { addAccountUseCaseStub, validationStub, sut }
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
    expect(httpResponse).toEqual(ok(makeFakeAccount()))
  })

  it('should call Validation with correct value', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = vitest.spyOn(validationStub, 'validate')
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
