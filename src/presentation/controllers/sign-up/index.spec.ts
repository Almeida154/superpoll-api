import { describe, expect, it, vitest } from 'vitest'

import { SignUpController } from '.'

import {
  NoProvidedParamError,
  InternalServerError,
  InvalidParamError,
} from '@/presentation/errors'

import { EmailValidator, AccountModel, AddAccountUseCase } from './protocols'

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(): boolean {
      return true
    }
  }

  return new EmailValidatorStub()
}

const makeAddAccount = (): AddAccountUseCase => {
  class AddAccountStub implements AddAccountUseCase {
    async execute(): Promise<AccountModel> {
      return new Promise((resolve) =>
        resolve({
          id: 'valid_id',
          name: 'John Doe',
          email: 'john@doe.com',
          password: 'any_password',
        }),
      )
    }
  }

  return new AddAccountStub()
}

interface ISut {
  emailValidatorStub: EmailValidator
  addAccountStub: AddAccountUseCase
  sut: SignUpController
}

const makeSUT = (): ISut => {
  const emailValidatorStub = makeEmailValidator()
  const addAccountStub = makeAddAccount()
  const sut = new SignUpController(emailValidatorStub, addAccountStub)

  return { emailValidatorStub, addAccountStub, sut }
}

describe('SignUp Controller', () => {
  it('Should returns 400 if no name was provided', async () => {
    const { sut } = makeSUT()

    const httpRequest = {
      body: {
        email: 'john@doe.com',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    }

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new NoProvidedParamError('name'))
  })

  it('Should returns 400 if no email was provided', async () => {
    const { sut } = makeSUT()

    const httpRequest = {
      body: {
        name: 'John Doe',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    }

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new NoProvidedParamError('email'))
  })

  it('Should returns 400 if no password was provided', async () => {
    const { sut } = makeSUT()

    const httpRequest = {
      body: {
        name: 'John Doe',
        email: 'john@doe.com',
        passwordConfirmation: 'any_password',
      },
    }

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new NoProvidedParamError('password'))
  })

  it('Should returns 400 if no password confirmation was provided', async () => {
    const { sut } = makeSUT()

    const httpRequest = {
      body: {
        name: 'John Doe',
        email: 'john@doe.com',
        password: 'any_password',
      },
    }

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(
      new NoProvidedParamError('passwordConfirmation'),
    )
  })

  it('Should returns 400 if an invalid email was provided', async () => {
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

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('email'))
  })

  it('Should returns 400 if password confirmation fails', async () => {
    const { sut } = makeSUT()

    const httpRequest = {
      body: {
        name: 'John Doe',
        email: 'john@doe.com',
        password: 'any_password',
        passwordConfirmation: 'different_password',
      },
    }

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)

    expect(httpResponse.body).toEqual(
      new InvalidParamError('passwordConfirmation'),
    )
  })

  it('Should calls EmailValidator with correct email', async () => {
    const { sut, emailValidatorStub } = makeSUT()

    const isValidSpy = vitest.spyOn(emailValidatorStub, 'isValid')

    const httpRequest = {
      body: {
        name: 'John Doe',
        email: 'john@doe.com',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    }

    await sut.handle(httpRequest)

    expect(isValidSpy).toHaveBeenCalledWith('john@doe.com')
  })

  it('Should calls AddAccountUseCase with correct values', async () => {
    const { sut, addAccountStub } = makeSUT()

    const addSpy = vitest.spyOn(addAccountStub, 'execute')

    const httpRequest = {
      body: {
        name: 'John Doe',
        email: 'john@doe.com',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    }

    await sut.handle(httpRequest)

    expect(addSpy).toHaveBeenCalledWith({
      name: 'John Doe',
      email: 'john@doe.com',
      password: 'any_password',
    })
  })

  it('Should returns 500 if EmailValidator throws', async () => {
    const { sut, emailValidatorStub } = makeSUT()

    vitest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })

    const httpRequest = {
      body: {
        name: 'John Doe',
        email: 'jonh@doe.com',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    }

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new InternalServerError())
  })

  it('Should returns 500 if AddAccountUseCase throws', async () => {
    const { sut, addAccountStub } = makeSUT()

    vitest.spyOn(addAccountStub, 'execute').mockImplementationOnce(async () => {
      return new Promise((resolve, reject) => reject(new Error()))
    })

    const httpRequest = {
      body: {
        name: 'John Doe',
        email: 'jonh@doe.com',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    }

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new InternalServerError())
  })

  it('Should returns 200 if valid data is provided', async () => {
    const { sut } = makeSUT()

    const httpRequest = {
      body: {
        name: 'John Doe',
        email: 'john@doe.com',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    }

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(200)

    expect(httpResponse.body).toEqual({
      id: 'valid_id',
      name: 'John Doe',
      email: 'john@doe.com',
      password: 'any_password',
    })
  })
})
