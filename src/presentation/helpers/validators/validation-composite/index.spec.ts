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
  validationStub: IValidation
}

const makeSUT = (): ISut => {
  const validationStub = makeValidation()
  const sut = new ValidationComposite([validationStub])

  return {
    sut,
    validationStub,
  }
}

describe('ValidationComposite', () => {
  it('should return an error if any validation fails', () => {
    const { sut, validationStub } = makeSUT()
    vi.spyOn(validationStub, 'validate').mockReturnValueOnce(
      new NoProvidedParamError('field'),
    )
    const error = sut.validate({ anyField: 'any_value' })
    expect(error).toEqual(new NoProvidedParamError('field'))
  })
})
