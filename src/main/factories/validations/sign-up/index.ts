import {
  CompareFieldsValidation,
  IValidation,
  RequiredFieldValidation,
  ValidationComposite,
} from '@/presentation/helpers/validators'

export const makeSignUpValidation = (): IValidation => {
  const validations: IValidation[] = []

  for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
    validations.push(new RequiredFieldValidation(field))
  }

  validations.push(
    new CompareFieldsValidation('passwordConfirmation', 'password'),
  )

  return new ValidationComposite(validations)
}
