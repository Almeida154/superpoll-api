import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import MockDate from 'mockdate'

import {
  IHttpRequest,
  IValidation,
} from '../../authentication/sign-up/protocols'

import {
  badRequest,
  internalException,
  noContent,
} from '@/presentation/helpers/http'

import { IAddSurveyUseCase } from '@/domain/usecases/survey'

import { AddSurveyController } from '.'

const makeFakeRequest = (): IHttpRequest => ({
  body: {
    question: 'any_question',
    answers: [
      {
        image: 'any_image',
        answer: 'any_answer',
      },
    ],
    date: new Date(),
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

const makeAddSurveyUseCase = (): IAddSurveyUseCase => {
  class AddSurveyUseCaseStub implements IAddSurveyUseCase {
    execute(): Promise<void> {
      return new Promise((resolve) => resolve())
    }
  }

  return new AddSurveyUseCaseStub()
}

interface ISut {
  sut: AddSurveyController
  validationStub: IValidation
  addSurveyUseCaseStub: IAddSurveyUseCase
}

const makeSut = (): ISut => {
  const validationStub = makeValidation()
  const addSurveyUseCaseStub = makeAddSurveyUseCase()
  const sut = new AddSurveyController(validationStub, addSurveyUseCaseStub)

  return {
    sut,
    validationStub,
    addSurveyUseCaseStub,
  }
}

describe('AddSurveyController', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

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

  it('should call AddSurveyUseCase with correct values', async () => {
    const { sut, addSurveyUseCaseStub } = makeSut()
    const executeSpy = vi.spyOn(addSurveyUseCaseStub, 'execute')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(executeSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  it('should return 500 if AddSurveyUseCase throws', async () => {
    const { sut, addSurveyUseCaseStub } = makeSut()
    vi.spyOn(addSurveyUseCaseStub, 'execute').mockReturnValueOnce(
      new Promise((resolve, reject) => reject(new Error())),
    )
    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(internalException(new Error()))
  })

  it('should return 204 on success', async () => {
    const { sut } = makeSut()
    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(noContent())
  })
})
