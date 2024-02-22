import { AccountModel } from '@/domain/models'
import { IAddAccountUseCase, IAddAccountModel } from '@/domain/usecases'
import { IEncrypter, IAddAccountRepository } from '@/data/protocols'

export class AddAccountUseCase implements IAddAccountUseCase {
  private readonly encrypter: IEncrypter
  private readonly addAccountRepository: IAddAccountRepository

  constructor(
    addAccountRepository: IAddAccountRepository,
    encrypter: IEncrypter,
  ) {
    this.addAccountRepository = addAccountRepository
    this.encrypter = encrypter
  }

  async execute(account: IAddAccountModel): Promise<AccountModel> {
    const hashedPassword = await this.encrypter.encrypt(account.password)

    const data = await this.addAccountRepository.dispatch({
      ...account,
      password: hashedPassword,
    })

    return data
  }
}
