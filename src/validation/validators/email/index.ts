import { InvalidParamError } from '@/presentation/errors'
import { IValidation } from '@/presentation/protocols'
import { IEmailValidator } from '../../protocols'

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
