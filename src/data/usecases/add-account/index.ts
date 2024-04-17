import { AccountModel } from '@/domain/models'
import { IAddAccountUseCase, IAddAccountModel } from '@/domain/usecases'

import {
  IHashMaker,
  IAddAccountRepository,
  ILoadAccountByEmailRepository,
} from '@/data/protocols'

export class AddAccountUseCase implements IAddAccountUseCase {
  constructor(
    private readonly addAccountRepository: IAddAccountRepository,
    private readonly loadAccountByEmailRepository: ILoadAccountByEmailRepository,
    private readonly encrypter: IHashMaker,
  ) {}

  async execute(account: IAddAccountModel): Promise<AccountModel> {
    const hashedPassword = await this.encrypter.hash(account.password)
    await this.loadAccountByEmailRepository.loadByEmail(account.email)
    return await this.addAccountRepository.add({
      ...account,
      password: hashedPassword,
    })
  }
}
