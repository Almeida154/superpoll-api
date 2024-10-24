import { describe, expect, it, vi } from 'vitest'
import { LoadSurveysController } from '.'
import { ILoadSurveysUseCase } from '@/domain/usecases/survey/load'
import { SurveyModel } from '@/domain/models'

const makeFakeSurveys = () => [
  {
    id: 'any_id',
    question: 'any_question',
    answers: [
      {
        image: 'any_image',
        answer: 'any_answer',
      },
    ],
    date: new Date(),
  },
  {
    id: 'other_id',
    question: 'other_question',
    answers: [
      {
        image: 'other_image',
        answer: 'other_answer',
      },
    ],
    date: new Date(),
  },
]

const makeLoadSurveysUseCaseStub = (): ILoadSurveysUseCase => {
  class LoadSurveysUseCaseStub implements ILoadSurveysUseCase {
    execute(): Promise<SurveyModel[]> {
      return new Promise((resolve) => resolve(makeFakeSurveys()))
    }
  }

  return new LoadSurveysUseCaseStub()
}

const makeSut = () => {
  const loadSurveysUseCaseStub = makeLoadSurveysUseCaseStub()
  const sut = new LoadSurveysController(loadSurveysUseCaseStub)
  return { sut, loadSurveysUseCaseStub }
}

describe('LoadSurveysController', () => {
  it('should call LoadSurveysUseCase', async () => {
    const { sut, loadSurveysUseCaseStub } = makeSut()
    const executeSpy = vi.spyOn(loadSurveysUseCaseStub, 'execute')
    await sut.handle()
    expect(executeSpy).toHaveBeenCalled()
  })
})
