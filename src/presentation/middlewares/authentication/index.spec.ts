import { describe, expect, it } from 'vitest'

import { AccessDeniedError } from '@/presentation/errors'
import { forbidden } from '@/presentation/helpers/http'
import { AuthenticationMiddleware } from '.'

describe('AuthenticationMiddleware', () => {
  it('should return 403 if no x-access-token exists in headers', async () => {
    const sut = new AuthenticationMiddleware()
    const response = await sut.handle({})
    expect(response).toEqual(forbidden(new AccessDeniedError()))
  })
})
