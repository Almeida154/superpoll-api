import { describe, expect, it, vi } from 'vitest'

import { AccessDeniedError } from '@/presentation/errors'
import { forbidden, internalException, ok } from '@/presentation/helpers/http'
import { ILoadAccountByTokenUseCase } from '@/domain/usecases'

import { AuthenticationMiddleware } from '.'
import { AccountModel } from '@/domain/models'
import { IHttpRequest } from '@/presentation/protocols'

const makeFakeAccount = (): AccountModel => ({
  id: 'any_id',
  name: 'any_name',
  email: 'any@email.com',
  password: 'hashed_password',
})

const makeFakeRequest = (): IHttpRequest => ({
  headers: { 'x-access-token': 'any_token' },
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

const makeSut = (role?: string): ISut => {
  const loadAccountByTokenUseCaseStub = makeLoadAccountByTokenUseCase()
  const sut = new AuthenticationMiddleware(loadAccountByTokenUseCaseStub, role)

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

  it('should call LoadAccountByTokenUseCase with correct accessToken', async () => {
    const role = 'any_role'
    const { sut, loadAccountByTokenUseCaseStub } = makeSut(role)
    const loadSpy = vi.spyOn(loadAccountByTokenUseCaseStub, 'execute')
    await sut.handle(makeFakeRequest())
    expect(loadSpy).toHaveBeenCalledWith('any_token', role)
  })

  it('should return 403 if LoadAccountByTokenUseCase returns null', async () => {
    const { sut, loadAccountByTokenUseCaseStub } = makeSut()
    vi.spyOn(loadAccountByTokenUseCaseStub, 'execute').mockReturnValueOnce(
      new Promise((resolve) => resolve(null)),
    )
    const response = await sut.handle(makeFakeRequest())
    expect(response).toEqual(forbidden(new AccessDeniedError()))
  })

  it('should return 200 if LoadAccountByTokenUseCase returns an account', async () => {
    const { sut } = makeSut()
    const response = await sut.handle(makeFakeRequest())
    expect(response).toEqual(ok({ accountId: 'any_id' }))
  })

  it('should return 500 if LoadAccountByTokenUseCase throws', async () => {
    const { sut, loadAccountByTokenUseCaseStub } = makeSut()
    vi.spyOn(loadAccountByTokenUseCaseStub, 'execute').mockReturnValueOnce(
      new Promise((resolve, reject) => reject(new Error())),
    )
    const response = await sut.handle(makeFakeRequest())
    expect(response).toEqual(internalException(new Error()))
  })
})
