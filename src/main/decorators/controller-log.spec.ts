import { describe, expect, it, vi } from 'vitest'
import { ControllerLogDecorator } from './controller-log'

import {
  IController,
  IHttpRequest,
  IHttpResponse,
} from '@/presentation/protocols'

interface ISut {
  sut: ControllerLogDecorator
  controllerStub: IController
}

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

const makeSUT = (): ISut => {
  const controllerStub = makeController()
  const sut = new ControllerLogDecorator(controllerStub)

  return {
    controllerStub,
    sut,
  }
}

describe('ControllerLog Decorator', () => {
  it('Should calls controller handle', async () => {
    const { sut, controllerStub } = makeSUT()

    const handleSpy = vi.spyOn(controllerStub, 'handle')

    const httpRequest: IHttpRequest = {
      body: {
        email: 'any@mail.com',
        name: 'anu_name',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    }

    await sut.handle(httpRequest)
    expect(handleSpy).toHaveBeenCalledWith(httpRequest)
  })
})
