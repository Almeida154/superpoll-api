import { IHttpResponse } from '@/presentation/protocols'
import { InternalServerError, UnauthorizedError } from '@/presentation/errors'

export const badRequest = (error: Error): IHttpResponse => ({
  statusCode: 400,
  body: error,
})

export const unauthorized = (): IHttpResponse => ({
  statusCode: 401,
  body: new UnauthorizedError(),
})

export const forbidden = (error: Error): IHttpResponse => ({
  statusCode: 403,
  body: error,
})

export const internalException = (error: Error): IHttpResponse => ({
  statusCode: 500,
  body: new InternalServerError(error.stack),
})

export const ok = (data: unknown): IHttpResponse => ({
  statusCode: 200,
  body: data,
})
