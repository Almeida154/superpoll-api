import { IDecrypter } from '@/data/protocols/cryptography/decrypter'
import { AccountModel } from '@/domain/models'
import { ILoadAccountByTokenUseCase } from '@/domain/usecases/account'

export class LoadAccountByTokenUseCase implements ILoadAccountByTokenUseCase {
  constructor(private readonly decrypter: IDecrypter) {}
  execute(accessToken: string, role?: string): Promise<AccountModel> {
    console.log(accessToken, role)
    this.decrypter.decrypt(accessToken)
    return null
  }
}
