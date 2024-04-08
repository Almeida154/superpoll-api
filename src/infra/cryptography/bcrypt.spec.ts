import { describe, expect, it, vitest } from 'vitest'
import bcrypt from 'bcrypt'

import { BcryptAdapter } from './bcrypt'

import { IEncrypter } from '@/data/protocols'

interface ISut {
  sut: IEncrypter
  salt: number
}

const makeSut = (): ISut => {
  const salt = 12
  const sut = new BcryptAdapter(salt)

  return { sut, salt }
}

vitest.mock('bcrypt', () => ({
  default: {
    async hash(): Promise<string> {
      return new Promise((resolve) => resolve('hash'))
    },
  },
}))

describe('BcryptAdapter', () => {
  it('should call bcrypt with correct values', async () => {
    const { sut, salt } = makeSut()

    const hashSpy = vitest.spyOn(bcrypt, 'hash')
    await sut.encrypt('any_value')
    expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
  })

  it('should throw if bcrypt throws', async () => {
    const { sut } = makeSut()

    vitest.spyOn(bcrypt, 'hash').mockImplementationOnce(async () => {
      return new Promise((resolve, reject) => reject(new Error()))
    })

    const hashPromise = sut.encrypt('any_value')
    await expect(hashPromise).rejects.toThrow()
  })

  it('should return encrypted value on success', async () => {
    const { sut } = makeSut()
    const hash = await sut.encrypt('any_value')
    expect(hash).toBe('hash')
  })
})
