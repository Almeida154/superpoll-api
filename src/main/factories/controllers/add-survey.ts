import { AddSurveyUseCase } from '@/data/usecases/add-survey'
import { LogMongoRepository } from '@/infra/db/mongodb/repositories'
import { SurveyMongoRepository } from '@/infra/db/mongodb/repositories/survey'
import { ControllerLogDecorator } from '@/main/decorators'
import { AddSurveyController } from '@/presentation/controllers'
import { IController } from '@/presentation/protocols'
import { makeAddSurveyValidation } from '../validations'

export const makeAddSurveyController = (): IController => {
  const addSurveyRepository = new SurveyMongoRepository()
  const addSurveyUseCase = new AddSurveyUseCase(addSurveyRepository)
  const addSurveyController = new AddSurveyController(
    makeAddSurveyValidation(),
    addSurveyUseCase,
  )
  return new ControllerLogDecorator(
    addSurveyController,
    new LogMongoRepository(),
  )
}
