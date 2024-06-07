import { describe, expect, it, vi } from 'vitest'
import { IDecrypter } from '@/data/protocols/cryptography/decrypter'
import { LoadAccountByTokenUseCase } from '.'
import { ILoadAccountByTokenRepository } from '@/data/protocols'
import { AccountModel } from '@/domain/models'

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid@email.com',
  password: 'hashed_password',
})

const makeDecrypter = () => {
  class DecrypterStub implements IDecrypter {
    decrypt(): Promise<string> {
      return new Promise((resolve) => resolve('decrypted_value'))
    }
  }

  return new DecrypterStub()
}

const makeLoadAccountByTokenRepository = () => {
  class LoadAccountByTokenRepositoryStub
    implements ILoadAccountByTokenRepository
  {
    loadByToken(): Promise<AccountModel> {
      return new Promise((resolve) => resolve(makeFakeAccount()))
    }
  }

  return new LoadAccountByTokenRepositoryStub()
}

interface ISut {
  sut: LoadAccountByTokenUseCase
  decrypterStub: IDecrypter
  loadAccountByTokenRepositoryStub: ILoadAccountByTokenRepository
}

const makeSut = (): ISut => {
  const decrypterStub = makeDecrypter()
  const loadAccountByTokenRepositoryStub = makeLoadAccountByTokenRepository()
  const sut = new LoadAccountByTokenUseCase(
    decrypterStub,
    loadAccountByTokenRepositoryStub,
  )

  return {
    sut,
    decrypterStub,
    loadAccountByTokenRepositoryStub,
  }
}

describe('LoadAccountByTokenUseCase', () => {
  it('should call Decrypter with correct value', async () => {
    const { sut, decrypterStub } = makeSut()
    const decryptSpy = vi.spyOn(decrypterStub, 'decrypt')
    await sut.execute('any_token', 'any_role')
    expect(decryptSpy).toHaveBeenCalledWith('any_token')
  })

  it('should return null if Decrypter returns null', async () => {
    const { sut, decrypterStub } = makeSut()
    vi.spyOn(decrypterStub, 'decrypt').mockImplementationOnce(() => {
      return new Promise((resolve) => resolve(null))
    })
    const account = await sut.execute('any_token', 'any_role')
    expect(account).toBeNull()
  })

  it('should call LoadAccountByTokenRepository with correct values', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut()
    const loadByTokenSpy = vi.spyOn(
      loadAccountByTokenRepositoryStub,
      'loadByToken',
    )
    await sut.execute('any_token', 'any_role')
    expect(loadByTokenSpy).toHaveBeenCalledWith('any_token', 'any_role')
  })

  it('should return null if LoadAccountByTokenRepository returns null', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut()
    vi.spyOn(
      loadAccountByTokenRepositoryStub,
      'loadByToken',
    ).mockImplementationOnce(() => {
      return new Promise((resolve) => resolve(null))
    })
    const account = await sut.execute('any_token', 'any_role')
    expect(account).toBeNull()
  })
})
