import { SignUpController } from '@/presentation/controllers/sign-up'
import { AddAccountUseCase } from '@/data/usecases'
import { EmailValidatorAdapter } from '@/utils/email-validator/validator'
import { BcryptAdapter } from '@/infra/cryptography/bcrypt'
import { AccountMongoRepository } from '@/infra/db/mongodb/repositories/account'

export const makeSignUpController = (): SignUpController => {
  const encrypter = new BcryptAdapter(12)
  const accountRepository = new AccountMongoRepository()
  const addAccountUseCase = new AddAccountUseCase(accountRepository, encrypter)

  const emailValidator = new EmailValidatorAdapter()

  return new SignUpController(emailValidator, addAccountUseCase)
}
