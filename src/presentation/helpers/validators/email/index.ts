import { InvalidParamError } from '@/presentation/errors'
import { IEmailValidator } from '@/presentation/protocols'
import { IValidation } from '../../../protocols/validation'

export class EmailValidation implements IValidation {
  constructor(
    private readonly fieldName: string,
    private readonly emailValidator: IEmailValidator,
  ) {}

  validate(input: unknown): Error {
    const isEmailValid = this.emailValidator.isValid(input[this.fieldName])
    if (!isEmailValid) return new InvalidParamError(this.fieldName)
  }
}
