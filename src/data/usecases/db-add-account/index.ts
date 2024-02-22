import { AccountModel } from '@/domain/models'
import { AddAccountUseCase, AddAccountModel } from '@/domain/usecases'
import { Encrypter } from '@/data/protocols/encrypter'

export class DbAddAccountUseCase implements AddAccountUseCase {
  private readonly encrypter: Encrypter

  constructor(encrypter: Encrypter) {
    this.encrypter = encrypter
  }

  async execute(account: AddAccountModel): Promise<AccountModel> {
    await this.encrypter.encrypt(account.password)
    return new Promise((resolve) => resolve(null))
  }
}
