import { describe, expect, it, vitest } from 'vitest'

import { AddAccountModel } from '@/domain/usecases'
import { Encrypter } from '@/data/protocols/encrypter'

import { DbAddAccountUseCase } from '.'

describe('DbAddAccountUseCase', () => {
  it('Should call Encrypter with correct password', async () => {
    class EncrypterStub implements Encrypter {
      async encrypt(): Promise<string> {
        return new Promise((resolve) => resolve('hashed_password'))
      }
    }

    const encrypterStub = new EncrypterStub()

    const sut = new DbAddAccountUseCase(encrypterStub)

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
