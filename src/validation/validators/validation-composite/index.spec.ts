import { describe, expect, it, vi } from 'vitest'

import { NoProvidedParamError } from '@/presentation/errors'
import { IValidation } from '@/presentation/protocols'

import { ValidationComposite } from '.'

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

const makeSut = (): ISut => {
  const validationStubs = [makeValidation(), makeValidation()]
  const sut = new ValidationComposite(validationStubs)

  return {
    sut,
    validationStubs,
  }
}

describe('ValidationComposite', () => {
  it('should return an error if any validation fails', () => {
    const { sut, validationStubs } = makeSut()
    vi.spyOn(validationStubs[0], 'validate').mockReturnValueOnce(
      new NoProvidedParamError('field'),
    )
    const error = sut.validate({ anyField: 'any_value' })
    expect(error).toEqual(new NoProvidedParamError('field'))
  })

  it('should return the first error if more than one validation fails', () => {
    const { sut, validationStubs } = makeSut()
    vi.spyOn(validationStubs[0], 'validate').mockReturnValueOnce(new Error())
    vi.spyOn(validationStubs[1], 'validate').mockReturnValueOnce(
      new NoProvidedParamError('field'),
    )
    const error = sut.validate({ anyField: 'any_value' })
    expect(error).toEqual(new Error())
  })

  it('should not return if all validations succeed', () => {
    const { sut } = makeSut()
    const error = sut.validate({ anyField: 'any_value' })
    expect(error).toBeFalsy()
  })
})
