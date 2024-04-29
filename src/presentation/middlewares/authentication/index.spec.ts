import { describe, expect, it, vi } from 'vitest'

import { AccessDeniedError } from '@/presentation/errors'
import { forbidden } from '@/presentation/helpers/http'
import { ILoadAccountByTokenUseCase } from '@/domain/usecases'

import { AuthenticationMiddleware } from '.'
import { AccountModel } from '@/domain/models'

const makeFakeAccount = (): AccountModel => ({
  id: 'any_id',
  name: 'any_name',
  email: 'any@email.com',
  password: 'hashed_password',
})

const makeLoadAccountByTokenUseCase = (): ILoadAccountByTokenUseCase => {
  class LoadAccountByTokenUseCaseStub implements ILoadAccountByTokenUseCase {
    async execute(): Promise<AccountModel> {
      return new Promise((resolve) => resolve(makeFakeAccount()))
    }
  }

  return new LoadAccountByTokenUseCaseStub()
}

interface ISut {
  sut: AuthenticationMiddleware
  loadAccountByTokenUseCaseStub: ILoadAccountByTokenUseCase
}

const makeSut = (): ISut => {
  const loadAccountByTokenUseCaseStub = makeLoadAccountByTokenUseCase()
  const sut = new AuthenticationMiddleware(loadAccountByTokenUseCaseStub)

  return {
    sut,
    loadAccountByTokenUseCaseStub,
  }
}

describe('AuthenticationMiddleware', () => {
  it('should return 403 if no x-access-token exists in headers', async () => {
    const { sut } = makeSut()
    const response = await sut.handle({})
    expect(response).toEqual(forbidden(new AccessDeniedError()))
  })

  it('should call LoadAccountByToken with correct accessToken', async () => {
    const { sut, loadAccountByTokenUseCaseStub } = makeSut()
    const loadSpy = vi.spyOn(loadAccountByTokenUseCaseStub, 'execute')
    await sut.handle({
      headers: { 'x-access-token': 'any_token' },
    })
    expect(loadSpy).toHaveBeenCalledWith('any_token')
  })
})
