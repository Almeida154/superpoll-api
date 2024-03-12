import { describe, expect, it, vi } from 'vitest'
import { ControllerLogDecorator } from './controller-log'

import {
  IController,
  IHttpRequest,
  IHttpResponse,
} from '@/presentation/protocols'

import { internalServerError } from '@/presentation/helpers/http'
import { IErrorLogRepository } from '@/data/protocols/error-log-repository'

const makeController = (): IController => {
  class ControllerStub implements IController {
    handle(): Promise<IHttpResponse> {
      const httpResponse: IHttpResponse = {
        statusCode: 200,
        body: {
          anything: 'anything',
        },
      }
      return new Promise((resolve) => resolve(httpResponse))
    }
  }

  return new ControllerStub()
}

const makeErrorLogRepository = (): IErrorLogRepository => {
  class ErrorLogRepositoryStub implements IErrorLogRepository {
    log(): Promise<void> {
      return new Promise((resolve) => resolve())
    }
  }

  return new ErrorLogRepositoryStub()
}

interface ISut {
  sut: ControllerLogDecorator
  controllerStub: IController
  errorLogRepositoryStub: IErrorLogRepository
}

const makeSUT = (): ISut => {
  const controllerStub = makeController()
  const errorLogRepositoryStub = makeErrorLogRepository()
  const sut = new ControllerLogDecorator(controllerStub, errorLogRepositoryStub)

  return {
    controllerStub,
    sut,
    errorLogRepositoryStub,
  }
}

describe('ControllerLog Decorator', () => {
  it('Should calls controller handle', async () => {
    const { sut, controllerStub } = makeSUT()

    const handleSpy = vi.spyOn(controllerStub, 'handle')

    const httpRequest: IHttpRequest = {
      body: { anything: 'anything' },
    }

    await sut.handle(httpRequest)
    expect(handleSpy).toHaveBeenCalledWith(httpRequest)
  })

  it('Should returns the same result of the controller', async () => {
    const { sut } = makeSUT()

    const httpRequest: IHttpRequest = {
      body: { anything: 'anything' },
    }

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual({
      statusCode: 200,
      body: {
        anything: 'anything',
      },
    })
  })

  it('Should calls ErrorLogRepository with correct error if controller returns a server error', async () => {
    const { sut, controllerStub, errorLogRepositoryStub } = makeSUT()

    const fakeError = new Error()
    fakeError.stack = 'any_stack'

    const error = internalServerError(fakeError)

    vi.spyOn(controllerStub, 'handle').mockReturnValueOnce(
      new Promise((resolve) => resolve(error)),
    )

    const logSpy = vi.spyOn(errorLogRepositoryStub, 'log')

    const httpRequest: IHttpRequest = {
      body: { anything: 'anything' },
    }

    await sut.handle(httpRequest)
    expect(logSpy).toHaveBeenCalledWith('any_stack')
  })
})
