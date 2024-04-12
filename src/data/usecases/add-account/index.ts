import { AccountModel } from '@/domain/models'
import { IAddAccountUseCase, IAddAccountModel } from '@/domain/usecases'
import { IHashMaker, IAddAccountRepository } from '@/data/protocols'

export class AddAccountUseCase implements IAddAccountUseCase {
  constructor(
    private readonly repository: IAddAccountRepository,
    private readonly encrypter: IHashMaker,
  ) {}

  async execute(account: IAddAccountModel): Promise<AccountModel> {
    const hashedPassword = await this.encrypter.hash(account.password)
    return await this.repository.add({
      ...account,
      password: hashedPassword,
    })
  }
}
