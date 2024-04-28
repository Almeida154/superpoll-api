import { MongoClient } from '@/infra/db/mongodb/helpers/mongo-client'
import { IAddSurveyRepository } from '@/data/protocols'
import { IAddSurveyModel } from '@/domain/usecases/survey'
import { SurveyModel } from '@/domain/models'

export class SurveyMongoRepository implements IAddSurveyRepository {
  async add(survey: IAddSurveyModel): Promise<void> {
    const collection = await MongoClient.getCollection<SurveyModel>('surveys')
    await collection.insertOne(survey)
  }
}
