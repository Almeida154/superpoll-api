import { InvalidParamError } from '@/presentation/errors'
import { IEmailValidator } from '@/presentation/protocols'
import { IValidation } from '../../../protocols/validation'

export class EmailValidation implements IValidation {
  private readonly fieldName: string
  private readonly emailValidator: IEmailValidator

  constructor(fieldName: string, emailValidator: IEmailValidator) {
    this.fieldName = fieldName
    this.emailValidator = emailValidator
  }

  validate(input: unknown): Error {
    const isEmailValid = this.emailValidator.isValid(input[this.fieldName])
    if (!isEmailValid) return new InvalidParamError(this.fieldName)
  }
}
