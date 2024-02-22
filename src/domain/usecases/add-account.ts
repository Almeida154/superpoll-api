import { AccountModel } from '@/domain/models'

export interface IAddAccountModel {
  name: string
  email: string
  password: string
}

export interface IAddAccountUseCase {
  execute(account: IAddAccountModel): Promise<AccountModel>
}
