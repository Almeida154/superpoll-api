import { describe, expect, it, vi } from 'vitest'
import { AccountModel } from '@/domain/models'
import {
  IHashComparer,
  ILoadAccountByEmailRepository,
  ITokenGenerator,
} from '@/data/protocols'
import { AuthenticationUseCase } from '.'
import { IAuthCredentials } from '@/domain/usecases'

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

const makeHashComparer = (): IHashComparer => {
  class HashComparerStub implements IHashComparer {
    async compare(): Promise<boolean> {
      return new Promise((resolve) => resolve(true))
    }
  }

  return new HashComparerStub()
}

const makeTokenGenerator = (): ITokenGenerator => {
  class TokenGeneratorStub implements ITokenGenerator {
    async generate(): Promise<string> {
      return new Promise((resolve) => resolve('any_token'))
    }
  }

  return new TokenGeneratorStub()
}

interface ISut {
  sut: AuthenticationUseCase
  loadAccountByEmailRepositoryStub: ILoadAccountByEmailRepository
  hashComparerStub: IHashComparer
  tokenGeneratorStub: ITokenGenerator
}

const makeSut = (): ISut => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository()
  const hashComparerStub = makeHashComparer()
  const tokenGeneratorStub = makeTokenGenerator()

  const sut = new AuthenticationUseCase(
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    tokenGeneratorStub,
  )

  return {
    sut,
    loadAccountByEmailRepositoryStub,
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
    const tokenPromise = sut.execute(makeFakeAuthenticationCredentials())
    expect(tokenPromise).rejects.toThrow()
  })

  it('should return null if LoadAccountByEmailRepository returns null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    vi.spyOn(loadAccountByEmailRepositoryStub, 'load').mockReturnValueOnce(null)
    const token = await sut.execute(makeFakeAuthenticationCredentials())
    expect(token).toBeNull()
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
    const comparisonPromise = sut.execute(makeFakeAuthenticationCredentials())
    expect(comparisonPromise).rejects.toThrow()
  })

  it('should return null if HashComparer returns false', async () => {
    const { sut, hashComparerStub } = makeSut()
    vi.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(
      new Promise((resolve) => resolve(false)),
    )
    const token = await sut.execute(makeFakeAuthenticationCredentials())
    expect(token).toBeNull()
  })

  it('should call TokenGenerator with correct id', async () => {
    const { sut, tokenGeneratorStub } = makeSut()
    const generateSpy = vi.spyOn(tokenGeneratorStub, 'generate')
    await sut.execute(makeFakeAuthenticationCredentials())
    expect(generateSpy).toHaveBeenCalledWith('any_id')
  })
})