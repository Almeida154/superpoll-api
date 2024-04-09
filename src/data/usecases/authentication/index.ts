import {
  IHashComparer,
  ILoadAccountByEmailRepository,
  ITokenGenerator,
} from '@/data/protocols'

import { IAuthCredentials, IAuthenticationUseCase } from '@/domain/usecases'

export class AuthenticationUseCase implements IAuthenticationUseCase {
  private readonly loadAccountByEmailRepository: ILoadAccountByEmailRepository
  private readonly hashComparer: IHashComparer
  private readonly tokenGenerator: ITokenGenerator

  constructor(
    loadAccountByEmailRepository: ILoadAccountByEmailRepository,
    hashComparer: IHashComparer,
    tokenGenerator: ITokenGenerator,
  ) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository
    this.hashComparer = hashComparer
    this.tokenGenerator = tokenGenerator
  }

  async execute(credentials: IAuthCredentials): Promise<string> {
    const account = await this.loadAccountByEmailRepository.load(
      credentials.email,
    )
    if (!account) return null

    const isPasswordValid = await this.hashComparer.compare(
      credentials.password,
      account.password,
    )
    if (!isPasswordValid) return null

    return await this.tokenGenerator.generate(account.id)
  }
}
