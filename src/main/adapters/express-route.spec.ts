import { adaptRoute } from './express-route'
import { Request, Response } from 'express'
import { IController, IHttpResponse } from '@/presentation/protocols'
import { describe, expect, it, vi, vitest } from 'vitest'
import { InvalidParamError } from '@/presentation/errors'
import { badRequest, ok } from '@/presentation/helpers/http/http'

const makeFakeExpressRequest = () => ({}) as Request

const makeFakeExpressResponse = () =>
  ({
    status: vi.fn().mockReturnThis(),
    send: vi.fn(),
  }) as unknown as Response

const makeController = (): IController => {
  class ControllerStub implements IController {
    async handle(): Promise<IHttpResponse> {
      return new Promise((resolve) => resolve(ok({ value: 'any_value' })))
    }
  }

  return new ControllerStub()
}

interface ISut {
  sut: typeof adaptRoute
  controllerStub: IController
}

const makeSut = (): ISut => {
  const controllerStub = makeController()
  const sut = adaptRoute

  return {
    controllerStub,
    sut,
  }
}

describe('adaptRoute', () => {
  it('should return error message if status code is not 200', async () => {
    const { controllerStub, sut } = makeSut()
    const error = new InvalidParamError('email')

    vitest
      .spyOn(controllerStub, 'handle')
      .mockReturnValueOnce(new Promise((resolve) => resolve(badRequest(error))))

    const res = makeFakeExpressResponse()

    const adaptedRoute = sut(controllerStub)
    await adaptedRoute(makeFakeExpressRequest(), res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.send).toHaveBeenCalledWith({
      error: error.message,
    })
  })

  it('should return response body if status code is 200', async () => {
    const { controllerStub, sut } = makeSut()
    const res = makeFakeExpressResponse()
    const adaptedRoute = sut(controllerStub)
    await adaptedRoute(makeFakeExpressRequest(), res)
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.send).toHaveBeenCalledWith({ value: 'any_value' })
  })
})
