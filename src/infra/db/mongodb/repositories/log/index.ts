import { IErrorLogRepository } from '@/data/protocols'
import { MongoClient } from '../../helpers/mongo-client'

export class LogMongoRepository implements IErrorLogRepository {
  async logError(stack: string): Promise<void> {
    const collection = await MongoClient.getCollection<{
      stack: string
      date: Date
    }>('errors')

    collection.insertOne({
      stack,
      date: new Date(),
    })
  }
}
