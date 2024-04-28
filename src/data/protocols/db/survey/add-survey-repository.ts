import { IAddSurveyModel } from '@/domain/usecases/survey'

export interface IAddSurveyRepository {
  add(survey: IAddSurveyModel): Promise<void>
}
