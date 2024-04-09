import {
  IHashComparer,
  ILoadAccountByEmailRepository,
  ITokenGenerator,
  IUpdateAccessTokenRepository,
} from '@/data/protocols'

import { IAuthCredentials, IAuthenticationUseCase } from '@/domain/usecases'

export class AuthenticationUseCase implements IAuthenticationUseCase {
  private readonly loadAccountByEmailRepository: ILoadAccountByEmailRepository
  private readonly updateAccessTokenRepository: IUpdateAccessTokenRepository
  private readonly hashComparer: IHashComparer
  private readonly tokenGenerator: ITokenGenerator

  constructor(
    loadAccountByEmailRepository: ILoadAccountByEmailRepository,
    updateAccessTokenRepository: IUpdateAccessTokenRepository,
    hashComparer: IHashComparer,
    tokenGenerator: ITokenGenerator,
  ) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository
    this.updateAccessTokenRepository = updateAccessTokenRepository
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

    const accessToken = await this.tokenGenerator.generate(account.id)

    await this.updateAccessTokenRepository.update(account.id, accessToken)

    return accessToken
  }
}
