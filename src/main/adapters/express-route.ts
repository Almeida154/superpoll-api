import { Request, Response } from 'express'
import { IController, IHttpRequest } from '@/presentation/protocols'

export const adaptRoute = (controller: IController) => {
  return async (req: Request, res: Response) => {
    const request: IHttpRequest = {
      body: req.body,
    }

    const response = await controller.handle(request)
    const success = response.statusCode === 200

    return res
      .status(response.statusCode)
      .send(success ? response.body : { error: response.body.message })
  }
}
