import { InvalidParamError } from '@/presentation/errors'
import { IValidation } from '../../../protocols/validation'

export class CompareFieldsValidation implements IValidation {
  private readonly fieldName: string
  private readonly fieldNameToBeCompared: string

  constructor(fieldName: string, fieldNameToBeCompared: string) {
    this.fieldName = fieldName
    this.fieldNameToBeCompared = fieldNameToBeCompared
  }

  validate(input: unknown): Error {
    if (input[this.fieldName] !== input[this.fieldNameToBeCompared])
      return new InvalidParamError(this.fieldName)
  }
}
