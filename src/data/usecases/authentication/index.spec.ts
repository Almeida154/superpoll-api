import { describe, expect, it, vi } from 'vitest'
import { AccountModel } from '@/domain/models'
import { ILoadAccountByEmailRepository } from '@/data/protocols'
import { AuthenticationUseCase } from '.'
import { IAuthCredentials } from '@/domain/usecases'

const makeFakeAccount = (): AccountModel => ({
  id: 'any_id',
  email: 'any@email.com',
  name: 'any_name',
  password: 'any_password',
})

const makeFakeAuthenticationCredentials = (): IAuthCredentials => ({
  email: 'any@email.com',
  password: 'any_password',
})

const makeLoadAccountByEmailRepository = (): ILoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub
    // eslint-disable-next-line prettier/prettier
    implements ILoadAccountByEmailRepository {
    async load(): Promise<AccountModel> {
      return new Promise((resolve) => resolve(makeFakeAccount()))
    }
  }

  return new LoadAccountByEmailRepositoryStub()
}

interface ISut {
  sut: AuthenticationUseCase
  loadAccountByEmailRepositoryStub: ILoadAccountByEmailRepository
}

const makeSut = (): ISut => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository()
  const sut = new AuthenticationUseCase(loadAccountByEmailRepositoryStub)

  return {
    sut,
    loadAccountByEmailRepositoryStub,
  }
}

describe('AuthenticationUseCase', () => {
  it('should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const loadSpy = vi.spyOn(loadAccountByEmailRepositoryStub, 'load')
    await sut.execute(makeFakeAuthenticationCredentials())
    expect(loadSpy).toHaveBeenCalledWith('any@email.com')
  })

  it('should throw if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    vi.spyOn(loadAccountByEmailRepositoryStub, 'load').mockReturnValueOnce(
      new Promise((resolve, reject) => reject(new Error())),
    )
    const tokenPromise = sut.execute(makeFakeAuthenticationCredentials())
    expect(tokenPromise).rejects.toThrow()
  })
})
