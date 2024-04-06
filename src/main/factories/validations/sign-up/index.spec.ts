import { describe, expect, it, vi } from 'vitest'

import {
  CompareFieldsValidation,
  IValidation,
  RequiredFieldValidation,
  ValidationComposite,
} from '@/presentation/helpers/validators'

import { makeSignUpValidation } from '.'

vi.mock('@/presentation/helpers/validators/validation-composite')

describe('SignUpValidation Factory', () => {
  it('should call ValidationComposite with all validations', () => {
    makeSignUpValidation()

    const validations: IValidation[] = []

    for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
      validations.push(new RequiredFieldValidation(field))
    }

    validations.push(
      new CompareFieldsValidation('passwordConfirmation', 'password'),
    )

    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
