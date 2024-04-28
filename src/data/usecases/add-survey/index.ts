import { IAddSurveyRepository } from '@/data/protocols'
import { IAddSurveyModel, IAddSurveyUseCase } from '@/domain/usecases/survey'

export class AddSurveyUseCase implements IAddSurveyUseCase {
  constructor(private readonly addSurveyRepository: IAddSurveyRepository) {}

  async execute(survey: IAddSurveyModel): Promise<void> {
    await this.addSurveyRepository.add(survey)
  }
}
