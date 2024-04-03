import { describe, expect, it, vi } from 'vitest'

import { IEmailValidator, IHttpRequest } from '@/presentation/protocols'
import { badRequest, internalServerError } from '@/presentation/helpers/http'
import { InvalidParamError, NoProvidedParamError } from '@/presentation/errors'

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

interface ISut {
  sut: LoginController
  emailValidatorStub: IEmailValidator
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
    vi.spyOn(emailValidatorStub, 'isValid').mockImplementation(() => {
      throw new Error()
    })
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(internalServerError(new Error()))
  })

  it('should return 404 if user not found', () => null)

  it('should return 200 on success', () => null)
})