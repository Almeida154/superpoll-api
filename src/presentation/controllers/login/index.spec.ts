import { describe, expect, it } from 'vitest'

import { IHttpRequest } from '@/presentation/protocols'
import { badRequest } from '@/presentation/helpers/http'
import { NoProvidedParamError } from '@/presentation/errors'

import { LoginController } from '.'

describe('LoginController', () => {
  it('should return 400 if no email is provided', async () => {
    const sut = new LoginController()
    const httpRequest: IHttpRequest = {
      body: {
        password: 'any_password',
      },
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new NoProvidedParamError('email')))
  })

  it('should return 400 if no password is provided', async () => {
    const sut = new LoginController()
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
