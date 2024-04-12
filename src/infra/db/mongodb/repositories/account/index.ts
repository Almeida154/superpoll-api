import { MongoClient } from '@/infra/db/mongodb/helpers/mongo-client'

import {
  IAddAccountRepository,
  ILoadAccountByEmailRepository,
} from '@/data/protocols'

import { AccountModel } from '@/domain/models'
import { IAddAccountModel } from '@/domain/usecases'

export class AccountMongoRepository
  implements IAddAccountRepository, ILoadAccountByEmailRepository
{
  async add(account: IAddAccountModel): Promise<AccountModel> {
    const collection = await MongoClient.getCollection('accounts')
    const { insertedId } = await collection.insertOne(account)
    const result = await collection.findOne({ _id: insertedId })
    return MongoClient.map<AccountModel>(result)
  }

  async loadByEmail(email: string): Promise<AccountModel> {
    const collection = await MongoClient.getCollection('accounts')
    const account = await collection.findOne({ email })
    return MongoClient.map<AccountModel>(account)
  }
}
