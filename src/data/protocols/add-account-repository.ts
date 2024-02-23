import { AccountModel } from '@/domain/models'
import { IAddAccountModel } from '@/domain/usecases'

export interface IAddAccountRepository {
  add(account: IAddAccountModel): Promise<AccountModel>
}
