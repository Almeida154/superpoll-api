import { describe, expect, it, vi, vitest } from 'vitest'

import { AccountModel } from '@/domain/models'
import { IAddAccountModel, IAddAccountUseCase } from '@/domain/usecases'
import {
  IHashMaker,
  IAddAccountRepository,
  ILoadAccountByEmailRepository,
} from '@/data/protocols'

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

const makeLoadAccountByEmailRepository = (): ILoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub
    implements ILoadAccountByEmailRepository
  {
    async loadByEmail(): Promise<AccountModel> {
      return new Promise((resolve) => resolve(null))
    }
  }

  return new LoadAccountByEmailRepositoryStub()
}

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid@email.com',
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
  loadAccountByEmailRepositoryStub: ILoadAccountByEmailRepository
}

const makeSut = (): ISut => {
  const encrypterStub = makeHashMaker()
  const addAccountRepositoryStub = makeAddAccountRepository()
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository()

  const sut = new AddAccountUseCase(
    addAccountRepositoryStub,
    loadAccountByEmailRepositoryStub,
    encrypterStub,
  )

  return {
    sut,
    encrypterStub,
    addAccountRepositoryStub,
    loadAccountByEmailRepositoryStub,
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

  it('should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const loadByEmailSpy = vi.spyOn(
      loadAccountByEmailRepositoryStub,
      'loadByEmail',
    )
    await sut.execute(makeFakeAddAccountData())
    expect(loadByEmailSpy).toHaveBeenCalledWith('valid@email.com')
  })

  it('should return null if LoadAccountByEmailRepository not returns null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()

    vi.spyOn(
      loadAccountByEmailRepositoryStub,
      'loadByEmail',
    ).mockReturnValueOnce(new Promise((resolve) => resolve(makeFakeAccount())))

    const account = await sut.execute(makeFakeAddAccountData())
    expect(account).toBeNull()
  })

  it('should return an account on success', async () => {
    const { sut } = makeSut()

    const account = await sut.execute(makeFakeAddAccountData())
    expect(account).toEqual(makeFakeAccount())
  })
})
