import {
  CompareFieldsValidation,
  EmailValidation,
  RequiredFieldValidation,
  ValidationComposite,
} from '@/validation/validators'

import { IValidation } from '@/presentation/protocols'

import { EmailValidatorAdapter } from '@/infra/validators/email-validator'

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
