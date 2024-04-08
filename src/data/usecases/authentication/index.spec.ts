import { describe, expect, it, vi } from 'vitest'
import { AuthenticationUseCase } from '.'
import { AccountModel } from '@/domain/models'
import { ILoadAccountByEmailRepository } from '@/data/protocols'

describe('AuthenticationUseCase', () => {
  it('should call LoadAccountByEmailRepository with correct email', async () => {
    class LoadAccountByEmailRepositoryStub
      implements ILoadAccountByEmailRepository
    {
      async load(): Promise<AccountModel> {
        const account: AccountModel = {
          id: 'any_id',
          email: 'any@email.com',
          name: 'any_name',
          password: 'any_password',
        }
        return new Promise((resolve) => resolve(account))
      }
    }
    const loadAccountByEmailRepositoryStub =
      new LoadAccountByEmailRepositoryStub()
    const sut = new AuthenticationUseCase(loadAccountByEmailRepositoryStub)
    const loadSpy = vi.spyOn(loadAccountByEmailRepositoryStub, 'load')
    await sut.execute({ email: 'any@email.com', password: 'any_password' })
    expect(loadSpy).toHaveBeenCalledWith('any@email.com')
  })
})
