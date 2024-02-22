import { describe, expect, it, vitest } from 'vitest'
import validator from 'validator'

import { EmailValidatorAdapter } from '.'

describe('EmailValidatorAdapter', () => {
  it('Should returns false if validator returns false', () => {
    const sut = new EmailValidatorAdapter()
    vitest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)
    const isEmailValid = sut.isValid('invalid@email.com')
    expect(isEmailValid).toBe(false)
  })

  it('Should returns true if validator returns true', () => {
    const sut = new EmailValidatorAdapter()
    vitest.spyOn(validator, 'isEmail').mockReturnValueOnce(true)
    const isEmailValid = sut.isValid('valid@email.com')
    expect(isEmailValid).toBe(true)
  })
})
