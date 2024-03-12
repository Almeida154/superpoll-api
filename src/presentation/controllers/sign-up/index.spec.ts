import { describe, expect, it, vitest } from 'vitest'

import { SignUpController } from '.'

import {
  NoProvidedParamError,
  InternalServerError,
  InvalidParamError,
} from '@/presentation/errors'

import {
  ok,
  internalServerError,
  badRequest,
} from '@/presentation/helpers/http'

import {
  IEmailValidator,
  AccountModel,
  IAddAccountUseCase,
  IHttpRequest,
} from './protocols'

const makeEmailValidator = (): IEmailValidator => {
  class EmailValidatorStub implements IEmailValidator {
    isValid(): boolean {
      return true
    }
  }

  return new EmailValidatorStub()
}

const makeAddAccountUseCase = (): IAddAccountUseCase => {
  class AddAccountStub implements IAddAccountUseCase {
    async execute(): Promise<AccountModel> {
      return new Promise((resolve) => resolve(makeFakeAccount()))
    }
  }

  return new AddAccountStub()
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
  emailValidatorStub: IEmailValidator
  addAccountUseCaseStub: IAddAccountUseCase
  sut: SignUpController
}

const makeSUT = (): ISut => {
  const emailValidatorStub = makeEmailValidator()
  const addAccountUseCaseStub = makeAddAccountUseCase()
  const sut = new SignUpController(emailValidatorStub, addAccountUseCaseStub)

  return { emailValidatorStub, addAccountUseCaseStub, sut }
}

describe('SignUp Controller', () => {
  it('Should returns 400 if no name was provided', async () => {
    const { sut } = makeSUT()

    const httpRequest = {
      body: {
        email: 'any@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    }

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new NoProvidedParamError('name')))
  })

  it('Should returns 400 if no email was provided', async () => {
    const { sut } = makeSUT()

    const httpRequest = {
      body: {
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    }

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new NoProvidedParamError('email')))
  })

  it('Should returns 400 if no password was provided', async () => {
    const { sut } = makeSUT()

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any@mail.com',
        passwordConfirmation: 'any_password',
      },
    }

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(
      badRequest(new NoProvidedParamError('password')),
    )
  })

  it('Should returns 400 if no password confirmation was provided', async () => {
    const { sut } = makeSUT()

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any@mail.com',
        password: 'any_password',
      },
    }

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(
      badRequest(new NoProvidedParamError('passwordConfirmation')),
    )
  })

  it('Should returns 400 if an invalid email was provided', async () => {
    const { sut, emailValidatorStub } = makeSUT()

    vitest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)

    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')))
  })

  it('Should returns 400 if password confirmation fails', async () => {
    const { sut } = makeSUT()

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any@mail.com',
        password: 'any_password',
        passwordConfirmation: 'different_password',
      },
    }

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(
      badRequest(new InvalidParamError('passwordConfirmation')),
    )
  })

  it('Should calls EmailValidator with correct email', async () => {
    const { sut, emailValidatorStub } = makeSUT()

    const isValidSpy = vitest.spyOn(emailValidatorStub, 'isValid')

    await sut.handle(makeFakeRequest())
    expect(isValidSpy).toHaveBeenCalledWith('any@mail.com')
  })

  it('Should calls AddAccountUseCase with correct values', async () => {
    const { sut, addAccountUseCaseStub } = makeSUT()

    const addSpy = vitest.spyOn(addAccountUseCaseStub, 'execute')

    await sut.handle(makeFakeRequest())

    expect(addSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any@mail.com',
      password: 'any_password',
    })
  })

  it('Should returns 500 if EmailValidator throws', async () => {
    const { sut, emailValidatorStub } = makeSUT()

    vitest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })

    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(
      internalServerError(new InternalServerError(null)),
    )
  })

  it('Should returns 500 if AddAccountUseCase throws', async () => {
    const { sut, addAccountUseCaseStub } = makeSUT()

    vitest
      .spyOn(addAccountUseCaseStub, 'execute')
      .mockImplementationOnce(async () => {
        return new Promise((resolve, reject) => reject(new Error()))
      })

    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(
      internalServerError(new InternalServerError(null)),
    )
  })

  it('Should returns 200 if valid data is provided', async () => {
    const { sut } = makeSUT()

    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(ok(makeFakeAccount()))
  })
})
