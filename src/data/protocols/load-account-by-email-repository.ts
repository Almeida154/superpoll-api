import { AccountModel } from '@/domain/models'

export interface ILoadAccountByEmailRepository {
  load(email: string): Promise<AccountModel>
}
