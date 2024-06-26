import { NoProvidedParamError } from '@/presentation/errors'
import { IValidation } from '@/presentation/protocols'

export class RequiredFieldValidation implements IValidation {
  constructor(private readonly fieldName: string) {}

  validate(input: unknown): Error {
    if (!input[this.fieldName]) return new NoProvidedParamError(this.fieldName)
  }
}
