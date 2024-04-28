import { describe, expect, it, vi } from 'vitest'
import { IAddSurveyModel } from '@/domain/usecases/survey'

import { AddSurveyUseCase } from '.'
import { IAddSurveyRepository } from '@/data/protocols'

const makeFakeSurvey = (): IAddSurveyModel => ({
  answers: [{ answer: 'any_answer', image: 'any_image' }],
  question: 'any_question',
})

const makeAddSurveyRepository = (): IAddSurveyRepository => {
  class AddSurveyRepositoryStub implements IAddSurveyRepository {
    add(): Promise<void> {
      return new Promise((resolve) => resolve())
    }
  }

  return new AddSurveyRepositoryStub()
}

interface ISut {
  sut: AddSurveyUseCase
  addSurveyRepositoryStub: IAddSurveyRepository
}

const makeSut = (): ISut => {
  const addSurveyRepositoryStub = makeAddSurveyRepository()
  const sut = new AddSurveyUseCase(addSurveyRepositoryStub)

  return {
    sut,
    addSurveyRepositoryStub,
  }
}

describe('AddSurveyUseCase', () => {
  it('should call AddSurveyRepository with correct values', async () => {
    const { sut, addSurveyRepositoryStub } = makeSut()
    const addSpy = vi.spyOn(addSurveyRepositoryStub, 'add')
    const survey = makeFakeSurvey()
    await sut.execute(survey)
    expect(addSpy).toHaveBeenCalledWith(survey)
  })

  it('should throw if AddSurveyRepository throws', async () => {
    const { sut, addSurveyRepositoryStub } = makeSut()
    vi.spyOn(addSurveyRepositoryStub, 'add').mockReturnValueOnce(
      new Promise((resolve, reject) => reject(new Error())),
    )
    const promise = sut.execute(makeFakeSurvey())
    expect(promise).rejects.toThrow()
  })
})
