import { describe, expect, it } from 'vitest'

import { InvalidParamError } from '@/presentation/errors'

import { CompareFieldsValidation } from '.'

const makeSUT = (): CompareFieldsValidation => {
  return new CompareFieldsValidation('field', 'fieldToBeCompared')
}

describe('CompareFieldsValidation', () => {
  it('should return a InvalidParamError if validation fails', () => {
    const sut = makeSUT()
    const error = sut.validate({
      field: 'field_value',
      fieldToBeCompared: 'field_to_be_compared_value',
    })
    expect(error).toEqual(new InvalidParamError('field'))
  })

  it('should not return if validation succeeds', () => {
    const sut = makeSUT()
    const error = sut.validate({
      field: 'field_value',
      fieldToBeCompared: 'field_value',
    })
    expect(error).toBeFalsy()
  })
})
