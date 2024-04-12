import { IErrorLogRepository } from '@/data/protocols/db/log/error-log-repository'

import {
  IController,
  IHttpRequest,
  IHttpResponse,
} from '@/presentation/protocols'

export class ControllerLogDecorator implements IController {
  constructor(
    private readonly controller: IController,
    private readonly logRepository: IErrorLogRepository,
  ) {}

  async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const httpResponse = await this.controller.handle(httpRequest)

    if (httpResponse.statusCode === 500) {
      await this.logRepository.logError(httpResponse.body.stack)
    }

    return httpResponse
  }
}
