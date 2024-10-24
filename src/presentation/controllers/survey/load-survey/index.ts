import { ILoadSurveysUseCase } from '@/domain/usecases/survey/load'
import { internalException, ok } from '@/presentation/helpers/http'
import { IController, IHttpResponse } from '@/presentation/protocols'

export class LoadSurveysController implements IController {
  constructor(private readonly loadSurveysUseCase: ILoadSurveysUseCase) {}

  async handle(): Promise<IHttpResponse> {
    try {
      const surveys = await this.loadSurveysUseCase.execute()
      return ok({ surveys })
    } catch (error) {
      return internalException(error)
    }
  }
}
