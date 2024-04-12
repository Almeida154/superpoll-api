import { describe, expect, it, vi } from 'vitest'

import {
  EmailValidation,
  IValidation,
  RequiredFieldValidation,
  ValidationComposite,
} from '@/presentation/helpers/validators'

import { IEmailValidator } from '@/presentation/protocols'
import { makeSignInValidation } from '.'

vi.mock('@/presentation/helpers/validators/validation-composite')

const makeEmailValidator = (): IEmailValidator => {
  class EmailValidatorStub implements IEmailValidator {
    isValid(): boolean {
      return true
    }
  }

  return new EmailValidatorStub()
}

describe('LoginValidation Factory', () => {
  it('should call ValidationComposite with all validations', () => {
    makeSignInValidation()
    const validations: IValidation[] = []
    for (const field of ['email', 'password']) {
      validations.push(new RequiredFieldValidation(field))
    }
    validations.push(new EmailValidation('email', makeEmailValidator()))
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
