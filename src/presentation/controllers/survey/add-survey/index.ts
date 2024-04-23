import {
  IController,
  IHttpRequest,
  IHttpResponse,
  IValidation,
} from '@/presentation/protocols'

export class AddSurveyController implements IController {
  constructor(private readonly validation: IValidation) {}

  handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    this.validation.validate(httpRequest.body)
    return null
  }
}
