import { badRequest, internalException } from '@/presentation/helpers/http'
import {
  IController,
  IHttpRequest,
  IHttpResponse,
  IValidation,
} from '@/presentation/protocols'

export class AddSurveyController implements IController {
  constructor(private readonly validation: IValidation) {}

  async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) return badRequest(error)
    } catch (error) {
      return internalException(error)
    }
  }
}
