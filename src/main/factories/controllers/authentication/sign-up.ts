import { SignUpController } from '@/presentation/controllers'
import { AddAccountUseCase, AuthenticationUseCase } from '@/data/usecases'
import { BcryptAdapter } from '@/infra/cryptography/bcrypt-adapter'

import {
  AccountMongoRepository,
  LogMongoRepository,
} from '@/infra/db/mongodb/repositories'

import { IController } from '@/presentation/protocols'
import { JwtAdapter } from '@/infra/cryptography'
import env from '@/main/config/env'

import { ControllerLogDecorator } from '../../../decorators'
import { makeSignUpValidation } from '../../validations'

export const makeSignUpController = (): IController => {
  const encrypter = new BcryptAdapter(12)
  const accountRepository = new AccountMongoRepository()
  const addAccountUseCase = new AddAccountUseCase(
    accountRepository,
    accountRepository,
    encrypter,
  )

  const bcryptAdapter = new BcryptAdapter(12)
  const jwtAdapter = new JwtAdapter(env.jwtSecret)

  const authenticationUseCase = new AuthenticationUseCase(
    accountRepository,
    accountRepository,
    bcryptAdapter,
    jwtAdapter,
  )

  const signUpController = new SignUpController(
    addAccountUseCase,
    authenticationUseCase,
    makeSignUpValidation(),
  )

  return new ControllerLogDecorator(signUpController, new LogMongoRepository())
}
