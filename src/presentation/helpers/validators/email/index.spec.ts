import { describe, expect, it, vitest } from 'vitest'

import { IEmailValidator } from '@/presentation/protocols'
import { InvalidParamError } from '@/presentation/errors'

import { EmailValidation } from '.'

const makeEmailValidator = (): IEmailValidator => {
  class EmailValidatorStub implements IEmailValidator {
    isValid(): boolean {
      return true
    }
  }

  return new EmailValidatorStub()
}

interface ISut {
  emailValidatorStub: IEmailValidator
  sut: EmailValidation
}

const makeSUT = (): ISut => {
  const emailValidatorStub = makeEmailValidator()
  const sut = new EmailValidation('email', emailValidatorStub)
  return { emailValidatorStub, sut }
}

describe('EmailValidation', () => {
  it('should return an error if EmailValidator returns false', () => {
    const { sut, emailValidatorStub } = makeSUT()
    vitest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const error = sut.validate({ email: 'any@mail.com' })
    expect(error).toEqual(new InvalidParamError('email'))
  })

  it('should call EmailValidator with correct email', () => {
    const { sut, emailValidatorStub } = makeSUT()
    const isValidSpy = vitest.spyOn(emailValidatorStub, 'isValid')
    sut.validate({ email: 'any@mail.com' })
    expect(isValidSpy).toHaveBeenCalledWith('any@mail.com')
  })

  it('should throw if EmailValidator throws', () => {
    const { sut, emailValidatorStub } = makeSUT()
    vitest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })
    expect(sut.validate).toThrow()
  })
})
