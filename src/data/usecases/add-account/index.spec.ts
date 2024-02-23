import { describe, expect, it, vitest } from 'vitest'

import { AccountModel } from '@/domain/models'
import { IAddAccountModel, IAddAccountUseCase } from '@/domain/usecases'
import { IEncrypter, IAddAccountRepository } from '@/data/protocols'

import { AddAccountUseCase } from '.'

const makeEncrypter = (): IEncrypter => {
  class EncrypterStub implements IEncrypter {
    async encrypt(): Promise<string> {
      return new Promise((resolve) => resolve('hashed_password'))
    }
  }

  return new EncrypterStub()
}

const makeAddAccountRepository = (): IAddAccountRepository => {
  class AddAccountRepositoryStub implements IAddAccountRepository {
    async add(): Promise<AccountModel> {
      const fakeAccount: AccountModel = {
        id: 'valid_id',
        name: 'valid_name',
        email: 'valid_email',
        password: 'hashed_password',
      }

      return new Promise((resolve) => resolve(fakeAccount))
    }
  }

  return new AddAccountRepositoryStub()
}

interface ISut {
  sut: IAddAccountUseCase
  encrypterStub: IEncrypter
  addAccountRepositoryStub: IAddAccountRepository
}

const makeSUT = (): ISut => {
  const encrypterStub = makeEncrypter()
  const addAccountRepositoryStub = makeAddAccountRepository()
  const sut = new AddAccountUseCase(addAccountRepositoryStub, encrypterStub)

  return {
    sut,
    encrypterStub,
    addAccountRepositoryStub,
  }
}

describe('IAddAccountUseCase', () => {
  it('Should calls Encrypter with correct password', async () => {
    const { sut, encrypterStub } = makeSUT()
    const encryptSpy = vitest.spyOn(encrypterStub, 'encrypt')

    const addAccountData: IAddAccountModel = {
      email: 'valid@email.com',
      name: 'valid_name',
      password: 'valid_password',
    }

    await sut.execute(addAccountData)

    expect(encryptSpy).toHaveBeenCalledWith(addAccountData.password)
  })

  it('Should throws if Encrypter throws', async () => {
    const { sut, encrypterStub } = makeSUT()

    vitest
      .spyOn(encrypterStub, 'encrypt')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error())),
      )

    const addAccountData: IAddAccountModel = {
      email: 'valid@email.com',
      name: 'valid_name',
      password: 'valid_password',
    }

    const accountPromise = sut.execute(addAccountData)
    await expect(accountPromise).rejects.toThrow()
  })

  it('Should calls AddAccountRepository with correct object', async () => {
    const { sut, addAccountRepositoryStub } = makeSUT()

    const addSpy = vitest.spyOn(addAccountRepositoryStub, 'add')

    const addAccountData: IAddAccountModel = {
      email: 'valid@email.com',
      name: 'valid_name',
      password: 'valid_password',
    }

    await sut.execute(addAccountData)

    expect(addSpy).toHaveBeenCalledWith({
      ...addAccountData,
      password: 'hashed_password',
    })
  })

  it('Should throws if AddAccountRepository throws', async () => {
    const { sut, addAccountRepositoryStub } = makeSUT()

    vitest
      .spyOn(addAccountRepositoryStub, 'add')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error())),
      )

    const addAccountData: IAddAccountModel = {
      email: 'valid@email.com',
      name: 'valid_name',
      password: 'valid_password',
    }

    const accountPromise = sut.execute(addAccountData)
    await expect(accountPromise).rejects.toThrow()
  })

  it('Should returns an account on success', async () => {
    const { sut } = makeSUT()

    const addAccountData: IAddAccountModel = {
      email: 'valid@email.com',
      name: 'valid_name',
      password: 'valid_password',
    }

    const account = await sut.execute(addAccountData)

    expect(account).toEqual({
      id: 'valid_id',
      name: 'valid_name',
      email: 'valid_email',
      password: 'hashed_password',
    })
  })
})
