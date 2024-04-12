import {
  CompareFieldsValidation,
  EmailValidation,
  IValidation,
  RequiredFieldValidation,
  ValidationComposite,
} from '@/presentation/helpers/validators'
import { EmailValidatorAdapter } from '@/main/adapters/email-validator'

export const makeSignUpValidation = (): IValidation => {
  const validations: IValidation[] = []

  for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
    validations.push(new RequiredFieldValidation(field))
  }
  validations.push(
    new CompareFieldsValidation('passwordConfirmation', 'password'),
  )
  validations.push(new EmailValidation('email', new EmailValidatorAdapter()))

  return new ValidationComposite(validations)
}
