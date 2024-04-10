import { describe, expect, it, vi } from 'vitest'
import jwt from 'jsonwebtoken'

import { JwtAdapter } from '.'

vi.mock('jsonwebtoken', () => ({
  default: {
    async sign(): Promise<string> {
      return new Promise((resolve) => resolve('encrypted_value'))
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
})
