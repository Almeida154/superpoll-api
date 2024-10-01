import { describe, expect, it, vi } from 'vitest'

import {
  RequiredFieldValidation,
  ValidationComposite,
} from '@/validation/validators'

import { IValidation } from '@/presentation/protocols'

import { makeAddSurveyValidation } from '.'

vi.mock('@/validation/validators/validation-composite')

describe('AddSurveyValidation Factory', () => {
  it('should call ValidationComposite with all validations', () => {
    makeAddSurveyValidation()
    const validations: IValidation[] = []
    for (const field of ['question', 'answers']) {
      validations.push(new RequiredFieldValidation(field))
    }
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
