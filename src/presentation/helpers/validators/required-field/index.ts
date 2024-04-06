import { NoProvidedParamError } from '@/presentation/errors'
import { IValidation } from '../validation'

export class RequiredFieldValidation implements IValidation {
  private readonly fieldName: string

  constructor(fieldName: string) {
    this.fieldName = fieldName
  }

  validate(input: unknown): Error {
    if (!input[this.fieldName]) return new NoProvidedParamError(this.fieldName)
  }
}
