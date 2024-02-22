import { describe, expect, it, vitest } from 'vitest'
import validator from 'validator'

import { EmailValidatorAdapter } from './validator'

const makeSUT = (): EmailValidatorAdapter => {
  return new EmailValidatorAdapter()
}

describe('EmailValidatorAdapter', () => {
  it('Should returns false if validator returns false', () => {
    const sut = makeSUT()
    vitest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)
    const isEmailValid = sut.isValid('invalid@email.com')
    expect(isEmailValid).toBe(false)
  })

  it('Should returns true if validator returns true', () => {
    const sut = makeSUT()
    vitest.spyOn(validator, 'isEmail').mockReturnValueOnce(true)
    const isEmailValid = sut.isValid('valid@email.com')
    expect(isEmailValid).toBe(true)
  })

  it('Should calls validator with correct email', () => {
    const sut = makeSUT()
    const isEmailSpy = vitest.spyOn(validator, 'isEmail')
    sut.isValid('any@email.com')
    expect(isEmailSpy).toHaveBeenCalledWith('any@email.com')
  })
})
