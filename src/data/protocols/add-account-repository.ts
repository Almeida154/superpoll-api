import { AccountModel } from '@/domain/models'
import { IAddAccountModel } from '@/domain/usecases'

export interface IAddAccountRepository {
  dispatch(account: IAddAccountModel): Promise<AccountModel>
}
