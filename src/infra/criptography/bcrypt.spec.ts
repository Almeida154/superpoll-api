import { describe, expect, it, vitest } from 'vitest'
import bcrypt from 'bcrypt'

import { BcryptAdapter } from './bcrypt'

import { IEncrypter } from '@/data/protocols'

interface ISut {
  sut: IEncrypter
  salt: number
}

const makeSUT = (): ISut => {
  const salt = 12
  const sut = new BcryptAdapter(salt)

  return { sut, salt }
}

describe('BcryptAdapter', () => {
  it('Should calls bcrypt with correct values', async () => {
    const { sut, salt } = makeSUT()

    const hashSpy = vitest.spyOn(bcrypt, 'hash')
    await sut.encrypt('any_value')
    expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
  })

  it('Should returns encrypted value', async () => null)
})
