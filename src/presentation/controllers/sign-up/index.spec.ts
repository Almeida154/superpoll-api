import { describe, expect, it, vitest } from 'vitest'

import { SignUpController } from '@/presentation/controllers/sign-up'

import {
  NoProvidedParamError,
  InternalServerError,
  InvalidParamError,
} from '@/presentation/errors'

import { EmailValidator, AccountModel, AddAccount } from './protocols'

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(): boolean {
      return true
    }
  }

  return new EmailValidatorStub()
}

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    execute(): AccountModel {
      return {
        id: 'valid_id',
        name: 'John Doe',
        email: 'john@doe.com',
        password: 'valid_password',
      }
    }
  }

  return new AddAccountStub()
}

interface ISut {
  emailValidatorStub: EmailValidator
  addAccountStub: AddAccount
  sut: SignUpController
}

const makeSUT = (): ISut => {
  const emailValidatorStub = makeEmailValidator()
  const addAccountStub = makeAddAccount()
  const sut = new SignUpController(emailValidatorStub, addAccountStub)

  return { emailValidatorStub, addAccountStub, sut }
}

describe('SignUp Controller', () => {
  it('Should returns 400 if no name was provided', () => {
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

  it('Should returns 400 if no email was provided', () => {
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

  it('Should returns 400 if no password was provided', () => {
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

  it('Should returns 400 if no password confirmation was provided', () => {
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

  it('Should returns 400 if an invalid email was provided', () => {
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

  it('Should returns 400 if password confirmation fails', () => {
    const { sut } = makeSUT()

    const httpRequest = {
      body: {
        name: 'John Doe',
        email: 'john@doe.com',
        password: 'any_password',
        passwordConfirmation: 'different_password',
      },
    }

    const httpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)

    expect(httpResponse.body).toEqual(
      new InvalidParamError('passwordConfirmation'),
    )
  })

  it('Should calls EmailValidator with correct email', () => {
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

    sut.handle(httpRequest)

    expect(isValidSpy).toHaveBeenCalledWith('john@doe.com')
  })

  it('Should calls AddAccount with correct values', () => {
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

    sut.handle(httpRequest)

    expect(addSpy).toHaveBeenCalledWith({
      name: 'John Doe',
      email: 'john@doe.com',
      password: 'any_password',
    })
  })

  it('Should returns 500 if EmailValidator throws', () => {
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

    const httpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new InternalServerError())
  })

  it('Should returns 500 if AddAccount throws', () => {
    const { sut, addAccountStub } = makeSUT()

    vitest.spyOn(addAccountStub, 'execute').mockImplementationOnce(() => {
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

    const httpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new InternalServerError())
  })
})
