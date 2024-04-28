import { Request, Response } from 'express'
import { IController, IHttpRequest } from '@/presentation/protocols'

export const adaptRoute = (controller: IController) => {
  return async (req: Request, res: Response) => {
    const request: IHttpRequest = {
      body: req.body,
    }

    const response = await controller.handle(request)
    const hasSucceed = [200, 201].includes(response.statusCode)

    return res
      .status(response.statusCode)
      .send(hasSucceed ? response.body : { error: response.body?.message })
  }
}
