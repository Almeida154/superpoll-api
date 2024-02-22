import { describe, expect, it, vitest } from 'vitest'

import { AddAccountModel } from '@/domain/usecases'
import { Encrypter } from '@/data/protocols/encrypter'

import { DbAddAccountUseCase } from '.'

interface ISut {
  sut: DbAddAccountUseCase
  encrypterStub: Encrypter
}

const makeSUT = (): ISut => {
  class EncrypterStub implements Encrypter {
    async encrypt(): Promise<string> {
      return new Promise((resolve) => resolve('hashed_password'))
    }
  }

  const encrypterStub = new EncrypterStub()
  const sut = new DbAddAccountUseCase(encrypterStub)

  return {
    sut,
    encrypterStub,
  }
}

describe('DbAddAccountUseCase', () => {
  it('Should calls Encrypter with correct password', async () => {
    const { sut, encrypterStub } = makeSUT()
    const encryptSpy = vitest.spyOn(encrypterStub, 'encrypt')

    const addAccountData: AddAccountModel = {
      email: 'valid@email.com',
      name: 'valid_name',
      password: 'valid_password',
    }

    await sut.execute(addAccountData)

    expect(encryptSpy).toHaveBeenLastCalledWith(addAccountData.password)
  })

  it('Should returns', async () => {
    const { sut, encrypterStub } = makeSUT()
    const encryptSpy = vitest.spyOn(encrypterStub, 'encrypt')

    const addAccountData: AddAccountModel = {
      email: 'valid@email.com',
      name: 'valid_name',
      password: 'valid_password',
    }

    await sut.execute(addAccountData)

    expect(encryptSpy).toHaveBeenLastCalledWith(addAccountData.password)
  })
})
