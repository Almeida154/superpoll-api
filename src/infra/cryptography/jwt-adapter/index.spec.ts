import { describe, expect, it, vi } from 'vitest'
import jwt from 'jsonwebtoken'

import { JwtAdapter } from '.'

vi.mock('jsonwebtoken', () => ({
  default: {
    async sign(): Promise<string> {
      return new Promise((resolve) => resolve('any_token'))
    },
  },
}))

describe('JwtAdapter', () => {
  it('should call sign with correct values', async () => {
    const sut = new JwtAdapter('secret')
    const signSpy = vi.spyOn(jwt, 'sign')
    await sut.encrypt('any_id')
    expect(signSpy).toHaveBeenCalledWith({ id: 'any_id' }, 'secret')
  })

  it('should return a token if sign succeed', async () => {
    const sut = new JwtAdapter('secret')
    const accessToken = await sut.encrypt('any_id')
    expect(accessToken).toBe('any_token')
  })
})
