import { describe, expect, it, vi } from 'vitest'
import jwt from 'jsonwebtoken'

import { JwtAdapter } from '.'

vi.mock('jsonwebtoken', () => ({
  default: {
    async sign(): Promise<string> {
      return new Promise((resolve) => resolve('any_token'))
    },
    async verify(): Promise<string> {
      return new Promise((resolve) => resolve('any_value'))
    },
  },
}))

const makeSut = () => {
  return new JwtAdapter('secret')
}

describe('JwtAdapter', () => {
  describe('sign()', () => {
    it('should call sign with correct values', async () => {
      const sut = makeSut()
      const signSpy = vi.spyOn(jwt, 'sign')
      await sut.encrypt('any_id')
      expect(signSpy).toHaveBeenCalledWith({ id: 'any_id' }, 'secret')
    })

    it('should return a token if sign succeed', async () => {
      const sut = makeSut()
      const accessToken = await sut.encrypt('any_id')
      expect(accessToken).toBe('any_token')
    })

    it('should throw if sign throws', async () => {
      const sut = makeSut()
      vi.spyOn(jwt, 'sign').mockImplementationOnce(() => {
        throw new Error()
      })
      const accessTokenPromise = sut.encrypt('any_id')
      await expect(accessTokenPromise).rejects.toThrow()
    })
  })

  describe('verify()', () => {
    it('should call verify with correct values', async () => {
      const sut = makeSut()
      const verifySpy = vi.spyOn(jwt, 'verify')
      await sut.decrypt('any_token')
      expect(verifySpy).toHaveBeenCalledWith('any_token', 'secret')
    })

    it('should return a value if verify succeed', async () => {
      const sut = makeSut()
      const value = await sut.decrypt('any_token')
      expect(value).toBe('any_value')
    })

    it('should throw if verify throws', async () => {
      const sut = makeSut()
      vi.spyOn(jwt, 'verify').mockImplementationOnce(() => {
        throw new Error()
      })
      const promise = sut.decrypt('any_token')
      await expect(promise).rejects.toThrow()
    })
  })
})
