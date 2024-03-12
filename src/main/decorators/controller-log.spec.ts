import { describe, expect, it, vi } from 'vitest'
import { ControllerLogDecorator } from './controller-log'

import {
  IController,
  IHttpRequest,
  IHttpResponse,
} from '@/presentation/protocols'

import { internalServerError, ok } from '@/presentation/helpers/http'
import { IErrorLogRepository } from '@/data/protocols'
import { AccountModel } from '@/domain/models'

const makeController = (): IController => {
  class ControllerStub implements IController {
    handle(): Promise<IHttpResponse> {
      return new Promise((resolve) => resolve(ok(makeFakeAccount())))
    }
  }

  return new ControllerStub()
}

const makeLogRepository = (): IErrorLogRepository => {
  class ErrorLogRepositoryStub implements IErrorLogRepository {
    logError(): Promise<void> {
      return new Promise((resolve) => resolve())
    }
  }

  return new ErrorLogRepositoryStub()
}

const makeFakeServerError = (): IHttpResponse => {
  const fakeError = new Error()
  fakeError.stack = 'any_stack'
  return internalServerError(fakeError)
}

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'any_name',
  email: 'any@mail.com',
  password: 'any_password',
})

const makeFakeRequest = (): IHttpRequest => ({
  body: {
    name: 'any_name',
    email: 'any@mail.com',
    password: 'any_password',
    passwordConfirmation: 'any_password',
  },
})

interface ISut {
  sut: ControllerLogDecorator
  controllerStub: IController
  errorLogRepositoryStub: IErrorLogRepository
}

const makeSUT = (): ISut => {
  const controllerStub = makeController()
  const errorLogRepositoryStub = makeLogRepository()
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

    await sut.handle(makeFakeRequest())
    expect(handleSpy).toHaveBeenCalledWith(makeFakeRequest())
  })

  it('Should returns the same result of the controller', async () => {
    const { sut } = makeSUT()

    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(ok(makeFakeAccount()))
  })

  it('Should calls ErrorLogRepository with correct error if controller returns a server error', async () => {
    const { sut, controllerStub, errorLogRepositoryStub } = makeSUT()

    vi.spyOn(controllerStub, 'handle').mockReturnValueOnce(
      new Promise((resolve) => resolve(makeFakeServerError())),
    )

    const logSpy = vi.spyOn(errorLogRepositoryStub, 'logError')

    await sut.handle(makeFakeRequest())
    expect(logSpy).toHaveBeenCalledWith('any_stack')
  })
})
