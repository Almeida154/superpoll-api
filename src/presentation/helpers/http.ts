import { HttpResponse } from '@/presentation/protocols'
import { InternalServerError } from '@/presentation/errors'

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: error,
})

export const internalServerError = (): HttpResponse => ({
  statusCode: 500,
  body: new InternalServerError(),
})

export const ok = (data: unknown): HttpResponse => ({
  statusCode: 200,
  body: data,
})
