import { describe, expect, it, vi } from 'vitest'

import {
  IHashComparer,
  ILoadAccountByEmailRepository,
  IEncrypter,
  IUpdateAccessTokenRepository,
} from '@/data/protocols'

import { AccountModel } from '@/domain/models'
import { IAuthCredentials } from '@/domain/usecases'

import { AuthenticationUseCase } from '.'

const makeFakeAccount = (): AccountModel => ({
  id: 'any_id',
  email: 'any@email.com',
  name: 'any_name',
  password: 'hashed_password',
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

const makeUpdateAccessTokenRepository = (): IUpdateAccessTokenRepository => {
  class UpdateAccessTokenRepository implements IUpdateAccessTokenRepository {
    async updateAccessToken(): Promise<void> {
      return new Promise((resolve) => resolve())
    }
  }

  return new UpdateAccessTokenRepository()
}

const makeHashComparer = (): IHashComparer => {
  class HashComparerStub implements IHashComparer {
    async compare(): Promise<boolean> {
      return new Promise((resolve) => resolve(true))
    }
  }

  return new HashComparerStub()
}

const makeEncrypter = (): IEncrypter => {
  class EncrypterStub implements IEncrypter {
    async encrypt(): Promise<string> {
      return new Promise((resolve) => resolve('any_token'))
    }
  }

  return new EncrypterStub()
}

interface ISut {
  sut: AuthenticationUseCase
  loadAccountByEmailRepositoryStub: ILoadAccountByEmailRepository
  updateAccessTokenRepositoryStub: IUpdateAccessTokenRepository
  hashComparerStub: IHashComparer
  tokenGeneratorStub: IEncrypter
}

const makeSut = (): ISut => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository()
  const updateAccessTokenRepositoryStub = makeUpdateAccessTokenRepository()
  const hashComparerStub = makeHashComparer()
  const tokenGeneratorStub = makeEncrypter()

  const sut = new AuthenticationUseCase(
    loadAccountByEmailRepositoryStub,
    updateAccessTokenRepositoryStub,
    hashComparerStub,
    tokenGeneratorStub,
  )

  return {
    sut,
    loadAccountByEmailRepositoryStub,
    updateAccessTokenRepositoryStub,
    hashComparerStub,
    tokenGeneratorStub,
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
    const accessTokenPromise = sut.execute(makeFakeAuthenticationCredentials())
    expect(accessTokenPromise).rejects.toThrow()
  })

  it('should return null if LoadAccountByEmailRepository returns null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    vi.spyOn(loadAccountByEmailRepositoryStub, 'load').mockReturnValueOnce(null)
    const accessToken = await sut.execute(makeFakeAuthenticationCredentials())
    expect(accessToken).toBeNull()
  })

  it('should call HashComparer with correct values', async () => {
    const { sut, hashComparerStub } = makeSut()
    const comparerSpy = vi.spyOn(hashComparerStub, 'compare')
    await sut.execute(makeFakeAuthenticationCredentials())
    expect(comparerSpy).toHaveBeenCalledWith('any_password', 'hashed_password')
  })

  it('should throw if HashComparer throws', async () => {
    const { sut, hashComparerStub } = makeSut()
    vi.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(
      new Promise((resolve, reject) => reject(new Error())),
    )
    const accessTokenPromise = sut.execute(makeFakeAuthenticationCredentials())
    expect(accessTokenPromise).rejects.toThrow()
  })

  it('should return null if HashComparer returns false', async () => {
    const { sut, hashComparerStub } = makeSut()
    vi.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(
      new Promise((resolve) => resolve(false)),
    )
    const accessToken = await sut.execute(makeFakeAuthenticationCredentials())
    expect(accessToken).toBeNull()
  })

  it('should call TokenGenerator with correct id', async () => {
    const { sut, tokenGeneratorStub } = makeSut()
    const generateSpy = vi.spyOn(tokenGeneratorStub, 'encrypt')
    await sut.execute(makeFakeAuthenticationCredentials())
    expect(generateSpy).toHaveBeenCalledWith('any_id')
  })

  it('should throw if TokenGenerator throws', async () => {
    const { sut, tokenGeneratorStub } = makeSut()
    vi.spyOn(tokenGeneratorStub, 'encrypt').mockReturnValueOnce(
      new Promise((resolve, reject) => reject(new Error())),
    )
    const accessTokenPromise = sut.execute(makeFakeAuthenticationCredentials())
    expect(accessTokenPromise).rejects.toThrow()
  })

  it('should return a access token on success', async () => {
    const { sut } = makeSut()
    const accessToken = await sut.execute(makeFakeAuthenticationCredentials())
    expect(accessToken).toBe('any_token')
  })

  it('should call UpdateAccessTokenRepository with correct values', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut()
    const updateSpy = vi.spyOn(
      updateAccessTokenRepositoryStub,
      'updateAccessToken',
    )
    await sut.execute(makeFakeAuthenticationCredentials())
    expect(updateSpy).toHaveBeenCalledWith('any_id', 'any_token')
  })

  it('should throw if UpdateAccessTokenRepository throws', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut()
    vi.spyOn(
      updateAccessTokenRepositoryStub,
      'updateAccessToken',
    ).mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const accessTokenPromise = sut.execute(makeFakeAuthenticationCredentials())
    expect(accessTokenPromise).rejects.toThrow()
  })
})
