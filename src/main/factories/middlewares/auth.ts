import { LoadAccountByTokenUseCase } from '@/data/usecases/load-account-by-token'
import { JwtAdapter } from '@/infra/cryptography'
import { AccountMongoRepository } from '@/infra/db/mongodb/repositories'
import { AuthenticationMiddleware } from '@/presentation/middlewares'
import { IMiddleware } from '@/presentation/protocols'
import env from '@/main/config/env'

export const makeAuthMiddleware = (role?: string): IMiddleware => {
  const loadAccountByTokenUseCase = new LoadAccountByTokenUseCase(
    new JwtAdapter(env.jwtSecret),
    new AccountMongoRepository(),
  )

  return new AuthenticationMiddleware(loadAccountByTokenUseCase, role)
}
