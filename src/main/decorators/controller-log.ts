import { IErrorLogRepository } from '@/data/protocols/error-log-repository'

import {
  IController,
  IHttpRequest,
  IHttpResponse,
} from '@/presentation/protocols'

export class ControllerLogDecorator implements IController {
  private readonly controller: IController
  private readonly errorLogRepository: IErrorLogRepository

  constructor(
    controller: IController,
    errorLogRepository: IErrorLogRepository,
  ) {
    this.controller = controller
    this.errorLogRepository = errorLogRepository
  }

  async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const httpResponse = await this.controller.handle(httpRequest)

    if (httpResponse.statusCode === 500) {
      await this.errorLogRepository.log(httpResponse.body.stack)
    }

    return httpResponse
  }
}
