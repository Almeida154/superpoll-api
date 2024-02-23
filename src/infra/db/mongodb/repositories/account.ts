import { MongoClient } from '@/infra/db/mongodb/helpers/mongo-client'

import { IAddAccountRepository } from '@/data/protocols'
import { AccountModel } from '@/domain/models'
import { IAddAccountModel } from '@/domain/usecases'

export class AccountMongoRepository implements IAddAccountRepository {
  async add(account: IAddAccountModel): Promise<AccountModel> {
    const collection = MongoClient.getCollection('accounts')
    await collection.insertOne(account)

    return MongoClient.map<AccountModel>(account)
  }
}
