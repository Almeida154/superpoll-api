import { NextFunction, Request, Response } from 'express'
import { IHttpRequest, IMiddleware } from '@/presentation/protocols'

export const adaptMiddleware = (middleware: IMiddleware) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const request: IHttpRequest = {
      headers: req.headers,
    }

    const response = await middleware.handle(request)
    const hasSucceed = response.statusCode === 200

    if (hasSucceed) {
      Object.assign(req, response.body)
      next()
      return
    }

    res.status(response.statusCode).json({ error: response.body.message })
  }
}
