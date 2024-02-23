import { AccountModel } from '@/domain/models'
import { IAddAccountUseCase, IAddAccountModel } from '@/domain/usecases'
import { IEncrypter, IAddAccountRepository } from '@/data/protocols'

export class AddAccountUseCase implements IAddAccountUseCase {
  private readonly encrypter: IEncrypter
  private readonly repository: IAddAccountRepository

  constructor(repository: IAddAccountRepository, encrypter: IEncrypter) {
    this.repository = repository
    this.encrypter = encrypter
  }

  async execute(account: IAddAccountModel): Promise<AccountModel> {
    const hashedPassword = await this.encrypter.encrypt(account.password)

    const data = await this.repository.add({
      ...account,
      password: hashedPassword,
    })

    return data
  }
}
