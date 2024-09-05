import env from '../../../config/env'

import { AuthenticationUseCase } from '@/data/usecases'

import {
  AccountMongoRepository,
  LogMongoRepository,
} from '@/infra/db/mongodb/repositories'

import { BcryptAdapter, JwtAdapter } from '@/infra/cryptography'

import { IController } from '@/presentation/protocols'
import { SignInController } from '@/presentation/controllers'

import { ControllerLogDecorator } from '../../../decorators'
import { makeSignInValidation } from '../../validations'

export const makeSignInController = (): IController => {
  const accountRepository = new AccountMongoRepository()
  const bcryptAdapter = new BcryptAdapter(12)
  const jwtAdapter = new JwtAdapter(env.jwtSecret)

  const authenticationUseCase = new AuthenticationUseCase(
    accountRepository,
    accountRepository,
    bcryptAdapter,
    jwtAdapter,
  )

  const signInController = new SignInController(
    authenticationUseCase,
    makeSignInValidation(),
  )

  return new ControllerLogDecorator(signInController, new LogMongoRepository())
}
