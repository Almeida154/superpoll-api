import { describe, expect, it, vi } from 'vitest'

import { NoProvidedParamError } from '@/presentation/errors'
import { ValidationComposite } from '.'
import { IValidation } from '../validation'

const makeValidation = (): IValidation => {
  class ValidationStub implements IValidation {
    validate(): Error {
      return null
    }
  }

  return new ValidationStub()
}

interface ISut {
  sut: ValidationComposite
  validationStubs: IValidation[]
}

const makeSUT = (): ISut => {
  const validationStubs = [makeValidation(), makeValidation()]
  const sut = new ValidationComposite(validationStubs)

  return {
    sut,
    validationStubs,
  }
}

describe('ValidationComposite', () => {
  it('should return an error if any validation fails', () => {
    const { sut, validationStubs } = makeSUT()
    vi.spyOn(validationStubs[0], 'validate').mockReturnValueOnce(
      new NoProvidedParamError('field'),
    )
    const error = sut.validate({ anyField: 'any_value' })
    expect(error).toEqual(new NoProvidedParamError('field'))
  })

  it('should not return if all validations succeed', () => {
    const { sut } = makeSUT()
    const error = sut.validate({ anyField: 'any_value' })
    expect(error).toBeFalsy()
  })
})
