import { describe, expect, it, vitest } from 'vitest'
import validator from 'validator'

import { EmailValidatorAdapter } from '.'

const makeSut = (): EmailValidatorAdapter => {
  return new EmailValidatorAdapter()
}

describe('EmailValidatorAdapter', () => {
  it('should return false if validator returns false', () => {
    const sut = makeSut()
    vitest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)
    const isEmailValid = sut.isValid('invalid@email.com')
    expect(isEmailValid).toBe(false)
  })

  it('should return true if validator returns true', () => {
    const sut = makeSut()
    vitest.spyOn(validator, 'isEmail').mockReturnValueOnce(true)
    const isEmailValid = sut.isValid('valid@email.com')
    expect(isEmailValid).toBe(true)
  })

  it('should call validator with correct email', () => {
    const sut = makeSut()
    const isEmailSpy = vitest.spyOn(validator, 'isEmail')
    sut.isValid('any@email.com')
    expect(isEmailSpy).toHaveBeenCalledWith('any@email.com')
  })
})
