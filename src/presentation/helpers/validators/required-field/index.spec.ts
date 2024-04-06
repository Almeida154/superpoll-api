import { describe, expect, it } from 'vitest'

import { NoProvidedParamError } from '@/presentation/errors'

import { RequiredFieldValidation } from '.'

const makeSUT = (): RequiredFieldValidation => {
  return new RequiredFieldValidation('requiredField')
}

describe('RequiredFieldValidation', () => {
  it('should return a NoProvidedParamError if validation fails', () => {
    const sut = makeSUT()
    const error = sut.validate({ anotherField: 'another_field_value' })
    expect(error).toEqual(new NoProvidedParamError('requiredField'))
  })

  it('should return null if validation does not fail', () => {
    const sut = makeSUT()
    const error = sut.validate({ requiredField: 'required_field_value' })
    expect(error).toBeUndefined()
  })
})
