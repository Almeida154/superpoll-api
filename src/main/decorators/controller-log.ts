import {
  IController,
  IHttpRequest,
  IHttpResponse,
} from '@/presentation/protocols'

export class ControllerLogDecorator implements IController {
  private readonly controller: IController

  constructor(controller: IController) {
    this.controller = controller
  }

  handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const httpResponse = this.controller.handle(httpRequest)
    return httpResponse
  }
}
