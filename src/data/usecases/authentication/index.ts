import { ILoadAccountByEmailRepository } from '@/data/protocols'
import { IAuthCredentials, IAuthenticationUseCase } from '@/domain/usecases'

export class AuthenticationUseCase implements IAuthenticationUseCase {
  private readonly loadAccountByEmailRepository: ILoadAccountByEmailRepository

  constructor(loadAccountByEmailRepository: ILoadAccountByEmailRepository) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository
  }

  async execute(credentials: IAuthCredentials): Promise<string> {
    await this.loadAccountByEmailRepository.load(credentials.email)
    return null
  }
}
