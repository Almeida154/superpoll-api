import { InvalidParamError } from '@/presentation/errors'
import { IValidation } from '../../../protocols/validation'

export class CompareFieldsValidation implements IValidation {
  constructor(
    private readonly fieldName: string,
    private readonly fieldNameToBeCompared: string,
  ) {}

  validate(input: unknown): Error {
    if (input[this.fieldName] !== input[this.fieldNameToBeCompared])
      return new InvalidParamError(this.fieldName)
  }
}
