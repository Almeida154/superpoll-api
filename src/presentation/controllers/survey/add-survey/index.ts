import { IAddSurveyUseCase } from '@/domain/usecases/survey'
import {
  badRequest,
  internalException,
  noContent,
} from '@/presentation/helpers/http'
import {
  IController,
  IHttpRequest,
  IHttpResponse,
  IValidation,
} from '@/presentation/protocols'

export class AddSurveyController implements IController {
  constructor(
    private readonly validation: IValidation,
    private readonly addSurveyUseCase: IAddSurveyUseCase,
  ) {}

  async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) return badRequest(error)

      const { question, answers } = httpRequest.body
      await this.addSurveyUseCase.execute({
        question,
        answers,
        date: new Date(),
      })

      return noContent()
    } catch (error) {
      return internalException(error)
    }
  }
}
