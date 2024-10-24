export interface ISurveyAnswer {
  image?: string
  answer: string
}

export interface IAddSurveyModel {
  question: string
  answers: ISurveyAnswer[]
  date: Date
}

export interface IAddSurveyUseCase {
  execute(survey: IAddSurveyModel): Promise<void>
}
