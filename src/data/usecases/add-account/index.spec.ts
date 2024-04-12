import { describe, expect, it, vitest } from 'vitest'

import { AccountModel } from '@/domain/models'
import { IAddAccountModel, IAddAccountUseCase } from '@/domain/usecases'
import { IHashMaker, IAddAccountRepository } from '@/data/protocols'

import { AddAccountUseCase } from '.'

const makeHashMaker = (): IHashMaker => {
  class HashMakerStub implements IHashMaker {
    async hash(): Promise<string> {
      return new Promise((resolve) => resolve('hashed_password'))
    }
  }

  return new HashMakerStub()
}

const makeAddAccountRepository = (): IAddAccountRepository => {
  class AddAccountRepositoryStub implements IAddAccountRepository {
    async add(): Promise<AccountModel> {
      return new Promise((resolve) => resolve(makeFakeAccount()))
    }
  }

  return new AddAccountRepositoryStub()
}

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email',
  password: 'hashed_password',
})

const makeFakeAddAccountData = (): IAddAccountModel => ({
  email: 'valid@email.com',
  name: 'valid_name',
  password: 'valid_password',
})

interface ISut {
  sut: IAddAccountUseCase
  encrypterStub: IHashMaker
  addAccountRepositoryStub: IAddAccountRepository
}

const makeSut = (): ISut => {
  const encrypterStub = makeHashMaker()
  const addAccountRepositoryStub = makeAddAccountRepository()
  const sut = new AddAccountUseCase(addAccountRepositoryStub, encrypterStub)

  return {
    sut,
    encrypterStub,
    addAccountRepositoryStub,
  }
}

describe('AddAccountUseCase', () => {
  it('should call Encrypter with correct password', async () => {
    const { sut, encrypterStub } = makeSut()
    const encryptSpy = vitest.spyOn(encrypterStub, 'hash')

    await sut.execute(makeFakeAddAccountData())
    expect(encryptSpy).toHaveBeenCalledWith('valid_password')
  })

  it('should throw if Encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut()

    vitest
      .spyOn(encrypterStub, 'hash')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error())),
      )

    const accountPromise = sut.execute(makeFakeAddAccountData())
    await expect(accountPromise).rejects.toThrow()
  })

  it('should call AddAccountRepository with correct object', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()

    const addSpy = vitest.spyOn(addAccountRepositoryStub, 'add')

    await sut.execute(makeFakeAddAccountData())
    expect(addSpy).toHaveBeenCalledWith({
      ...makeFakeAddAccountData(),
      password: 'hashed_password',
    })
  })

  it('should throw if AddAccountRepository throws', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()

    vitest
      .spyOn(addAccountRepositoryStub, 'add')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error())),
      )

    const accountPromise = sut.execute(makeFakeAddAccountData())
    await expect(accountPromise).rejects.toThrow()
  })

  it('should return an account on success', async () => {
    const { sut } = makeSut()

    const account = await sut.execute(makeFakeAddAccountData())
    expect(account).toEqual(makeFakeAccount())
  })
})
