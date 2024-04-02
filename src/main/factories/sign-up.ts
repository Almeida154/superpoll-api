import { SignUpController } from '@/presentation/controllers/sign-up'
import { AddAccountUseCase } from '@/data/usecases'
import { EmailValidatorAdapter } from '@/utils/email-validator/validator'
import { BcryptAdapter } from '@/infra/cryptography/bcrypt'
import {
  AccountMongoRepository,
  LogMongoRepository,
} from '@/infra/db/mongodb/repositories'
import { IController } from '@/presentation/protocols'

import { ControllerLogDecorator } from '../decorators'

export const makeSignUpController = (): IController => {
  const encrypter = new BcryptAdapter(12)
  const accountRepository = new AccountMongoRepository()
  const addAccountUseCase = new AddAccountUseCase(accountRepository, encrypter)

  const emailValidator = new EmailValidatorAdapter()

  const signUpController = new SignUpController(
    emailValidator,
    addAccountUseCase,
  )

  const logMongoRepository = new LogMongoRepository()
  return new ControllerLogDecorator(signUpController, logMongoRepository)
}
