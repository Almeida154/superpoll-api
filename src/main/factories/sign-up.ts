import { SignUpController } from '@/presentation/controllers/sign-up'
import { AddAccountUseCase } from '@/data/usecases'
import { EmailValidatorAdapter } from '@/utils/email-validator/validator'
import { BcryptAdapter } from '@/infra/cryptography/bcrypt'
import { AccountMongoRepository } from '@/infra/db/mongodb/repositories/account'
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

  return new ControllerLogDecorator(signUpController)
}
