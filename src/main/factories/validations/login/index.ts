import {
  EmailValidation,
  IValidation,
  RequiredFieldValidation,
  ValidationComposite,
} from '@/presentation/helpers/validators'

import { EmailValidatorAdapter } from '@/main/adapters/email-validator'

export const makeLoginValidation = (): IValidation => {
  const validations: IValidation[] = []
  for (const field of ['email', 'password']) {
    validations.push(new RequiredFieldValidation(field))
  }
  validations.push(new EmailValidation('email', new EmailValidatorAdapter()))
  return new ValidationComposite(validations)
}
