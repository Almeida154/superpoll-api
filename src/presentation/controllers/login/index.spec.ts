import { describe, expect, it } from 'vitest'

import { IHttpRequest } from '@/presentation/protocols'
import { badRequest } from '@/presentation/helpers/http'
import { NoProvidedParamError } from '@/presentation/errors'

import { LoginController } from '.'

interface ISut {
  sut: LoginController
}

const makeSUT = (): ISut => {
  const sut = new LoginController()

  return {
    sut,
  }
}

describe('LoginController', () => {
  it('should return 400 if no email is provided', async () => {
    const { sut } = makeSUT()
    const httpRequest: IHttpRequest = {
      body: {
        password: 'any_password',
      },
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new NoProvidedParamError('email')))
  })

  it('should return 400 if no password is provided', async () => {
    const { sut } = makeSUT()
    const httpRequest: IHttpRequest = {
      body: {
        email: 'any@email',
      },
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(
      badRequest(new NoProvidedParamError('password')),
    )
  })

  it('should return 404 if user not found', () => null)

  it('should return 200 on success', () => null)
})
