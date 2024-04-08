import { describe, expect, it } from 'vitest'

import { NoProvidedParamError } from '@/presentation/errors'

import { RequiredFieldValidation } from '.'

const makeSut = (): RequiredFieldValidation => {
  return new RequiredFieldValidation('requiredField')
}

describe('RequiredFieldValidation', () => {
  it('should return a NoProvidedParamError if validation fails', () => {
    const sut = makeSut()
    const error = sut.validate({ anotherField: 'another_field_value' })
    expect(error).toEqual(new NoProvidedParamError('requiredField'))
  })

  it('should not return if validation succeeds', () => {
    const sut = makeSut()
    const error = sut.validate({ requiredField: 'required_field_value' })
    expect(error).toBeFalsy()
  })
})
