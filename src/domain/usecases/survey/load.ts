import { SurveyModel } from '@/domain/models/survey'

export interface ILoadSurveysUseCase {
  execute(): Promise<SurveyModel[]>
}
