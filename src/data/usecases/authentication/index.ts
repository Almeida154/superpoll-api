import { IHashComparer, ILoadAccountByEmailRepository } from '@/data/protocols'
import { IAuthCredentials, IAuthenticationUseCase } from '@/domain/usecases'

export class AuthenticationUseCase implements IAuthenticationUseCase {
  private readonly loadAccountByEmailRepository: ILoadAccountByEmailRepository
  private readonly hashComparer: IHashComparer

  constructor(
    loadAccountByEmailRepository: ILoadAccountByEmailRepository,
    hashComparer: IHashComparer,
  ) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository
    this.hashComparer = hashComparer
  }

  async execute(credentials: IAuthCredentials): Promise<string> {
    const account = await this.loadAccountByEmailRepository.load(
      credentials.email,
    )

    if (!account) return null

    await this.hashComparer.compare(credentials.password, account.password)

    return null
  }
}
