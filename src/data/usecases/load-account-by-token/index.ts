import { ILoadAccountByTokenRepository } from '@/data/protocols'
import { IDecrypter } from '@/data/protocols/cryptography/decrypter'
import { AccountModel } from '@/domain/models'
import { ILoadAccountByTokenUseCase } from '@/domain/usecases/account'

export class LoadAccountByTokenUseCase implements ILoadAccountByTokenUseCase {
  constructor(
    private readonly decrypter: IDecrypter,
    private readonly loadAccountByTokenRepository: ILoadAccountByTokenRepository,
  ) {}

  async execute(accessToken: string, role?: string): Promise<AccountModel> {
    const token = await this.decrypter.decrypt(accessToken)
    if (!token) return null
    await this.loadAccountByTokenRepository.loadByToken(accessToken, role)
  }
}
