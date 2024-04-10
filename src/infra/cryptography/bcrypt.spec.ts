import { describe, expect, it, vitest } from 'vitest'
import bcrypt from 'bcrypt'

import { BcryptAdapter } from './bcrypt'

interface ISut {
  sut: BcryptAdapter
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
    async compare(): Promise<boolean> {
      return new Promise((resolve) => resolve(true))
    },
  },
}))

describe('BcryptAdapter', () => {
  it('should call hash with correct values', async () => {
    const { sut, salt } = makeSut()
    const hashSpy = vitest.spyOn(bcrypt, 'hash')
    await sut.hash('any_value')
    expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
  })

  it('should return a valid hash on hash value on success', async () => {
    const { sut } = makeSut()
    const hash = await sut.hash('any_value')
    expect(hash).toBe('hash')
  })

  it('should throw if bcrypt throws', async () => {
    const { sut } = makeSut()
    vitest.spyOn(bcrypt, 'hash').mockImplementationOnce(async () => {
      return new Promise((resolve, reject) => reject(new Error()))
    })
    const hashPromise = sut.hash('any_value')
    await expect(hashPromise).rejects.toThrow()
  })

  it('should call compare with correct values', async () => {
    const { sut } = makeSut()
    const compareSpy = vitest.spyOn(bcrypt, 'compare')
    await sut.compare('any_value', 'any_hash')
    expect(compareSpy).toHaveBeenCalledWith('any_value', 'any_hash')
  })
})
