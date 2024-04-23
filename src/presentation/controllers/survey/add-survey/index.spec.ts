import { describe, expect, it, vi } from 'vitest'

import {
  IHttpRequest,
  IValidation,
} from '../../authentication/sign-up/protocols'

import { AddSurveyController } from '.'
import { badRequest } from '@/presentation/helpers/http'

const makeFakeRequest = (): IHttpRequest => ({
  body: {
    question: 'any_question',
    answers: [
      {
        image: 'any_image',
        answer: 'any_answer',
      },
    ],
  },
})

const makeValidation = (): IValidation => {
  class ValidationStub implements IValidation {
    validate(): Error {
      return null
    }
  }

  return new ValidationStub()
}

interface ISut {
  sut: AddSurveyController
  validationStub: IValidation
}

const makeSut = (): ISut => {
  const validationStub = makeValidation()
  const sut = new AddSurveyController(validationStub)

  return {
    sut,
    validationStub,
  }
}

describe('AddSurveyController', () => {
  it('should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = vi.spyOn(validationStub, 'validate')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  it('should return 400 if Validation fails', async () => {
    const { sut, validationStub } = makeSut()
    vi.spyOn(validationStub, 'validate').mockReturnValueOnce(new Error())
    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new Error()))
  })
})
