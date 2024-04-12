import { SignUpController } from '@/presentation/controllers'
import { AddAccountUseCase } from '@/data/usecases'
import { BcryptAdapter } from '@/infra/cryptography/bcrypt-adapter'
import {
  AccountMongoRepository,
  LogMongoRepository,
} from '@/infra/db/mongodb/repositories'
import { IController } from '@/presentation/protocols'

import { ControllerLogDecorator } from '../../decorators'
import { makeSignUpValidation } from '../validations'

export const makeSignUpController = (): IController => {
  const encrypter = new BcryptAdapter(12)
  const accountRepository = new AccountMongoRepository()
  const addAccountUseCase = new AddAccountUseCase(accountRepository, encrypter)

  const signUpController = new SignUpController(
    addAccountUseCase,
    makeSignUpValidation(),
  )

  return new ControllerLogDecorator(signUpController, new LogMongoRepository())
}
