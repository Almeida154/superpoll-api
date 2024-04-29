import { AccountModel } from '@/domain/models'

export interface ILoadAccountByTokenUseCase {
  execute(accessToken: string, role?: string): Promise<AccountModel>
}
