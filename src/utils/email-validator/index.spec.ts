import { describe, expect, it } from 'vitest'

import { EmailValidatorAdapter } from '.'

describe('EmailValidatorAdapter', () => {
  it('Should returns false if validator returns false', () => {
    const sut = new EmailValidatorAdapter()
    const isEmailValid = sut.isValid('invalid@email.com')
    expect(isEmailValid).toBe(false)
  })
})
