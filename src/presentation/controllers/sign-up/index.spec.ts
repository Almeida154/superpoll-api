import { describe, expect, it, vitest } from 'vitest'

import { SignUpController } from '.'

import {
  NoProvidedParamError,
  InternalServerError,
  InvalidParamError,
} from '@/presentation/errors'

import { ok, internalException, badRequest } from '@/presentation/helpers/http'

import {
  IEmailValidator,
  AccountModel,
  IAddAccountUseCase,
  IHttpRequest,
} from './protocols'

import { IValidation } from '@/presentation/helpers/validators'

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
  emailValidatorStub: IEmailValidator
  addAccountUseCaseStub: IAddAccountUseCase
  validationStub: IValidation
  sut: SignUpController
}

const makeSUT = (): ISut => {
  const emailValidatorStub = makeEmailValidator()
  const addAccountUseCaseStub = makeAddAccountUseCase()
  const validationStub = makeValidation()
  const sut = new SignUpController(
    emailValidatorStub,
    addAccountUseCaseStub,
    validationStub,
  )

  return { emailValidatorStub, addAccountUseCaseStub, validationStub, sut }
}

describe('SignUp Controller', () => {
  it('should return 400 if no name was provided', async () => {
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

  it('should return 400 if no email was provided', async () => {
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

  it('should return 400 if no password was provided', async () => {
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

  it('should return 400 if no password confirmation was provided', async () => {
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

  it('should return 400 if an invalid email was provided', async () => {
    const { sut, emailValidatorStub } = makeSUT()

    vitest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)

    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')))
  })

  it('should return 400 if password confirmation fails', async () => {
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

  it('should call EmailValidator with correct email', async () => {
    const { sut, emailValidatorStub } = makeSUT()

    const isValidSpy = vitest.spyOn(emailValidatorStub, 'isValid')

    await sut.handle(makeFakeRequest())
    expect(isValidSpy).toHaveBeenCalledWith('any@mail.com')
  })

  it('should call AddAccountUseCase with correct values', async () => {
    const { sut, addAccountUseCaseStub } = makeSUT()

    const addSpy = vitest.spyOn(addAccountUseCaseStub, 'execute')

    await sut.handle(makeFakeRequest())

    expect(addSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any@mail.com',
      password: 'any_password',
    })
  })

  it('should return 500 if EmailValidator throws', async () => {
    const { sut, emailValidatorStub } = makeSUT()

    vitest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })

    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(
      internalException(new InternalServerError(null)),
    )
  })

  it('should return 500 if AddAccountUseCase throws', async () => {
    const { sut, addAccountUseCaseStub } = makeSUT()

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
    const { sut } = makeSUT()

    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(ok(makeFakeAccount()))
  })

  it('should call Validation with correct value', async () => {
    const { sut, validationStub } = makeSUT()
    const validateSpy = vitest.spyOn(validationStub, 'validate')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })
})
