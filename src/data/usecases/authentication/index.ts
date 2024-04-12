import {
  IHashComparer,
  ILoadAccountByEmailRepository,
  IEncrypter,
  IUpdateAccessTokenRepository,
} from '@/data/protocols'

import { IAuthCredentials, IAuthenticationUseCase } from '@/domain/usecases'

export class AuthenticationUseCase implements IAuthenticationUseCase {
  constructor(
    private readonly loadAccountByEmailRepository: ILoadAccountByEmailRepository,
    private readonly updateAccessTokenRepository: IUpdateAccessTokenRepository,
    private readonly hashComparer: IHashComparer,
    private readonly tokenGenerator: IEncrypter,
  ) {}

  async execute(credentials: IAuthCredentials): Promise<string> {
    const account = await this.loadAccountByEmailRepository.loadByEmail(
      credentials.email,
    )
    if (!account) return null

    const isPasswordValid = await this.hashComparer.compare(
      credentials.password,
      account.password,
    )
    if (!isPasswordValid) return null

    const accessToken = await this.tokenGenerator.encrypt(account.id)

    await this.updateAccessTokenRepository.updateAccessToken(
      account.id,
      accessToken,
    )

    return accessToken
  }
}
