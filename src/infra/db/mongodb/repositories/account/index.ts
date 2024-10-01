import { ObjectId } from 'mongodb'
import { MongoClient } from '@/infra/db/mongodb/helpers/mongo-client'

import {
  IAddAccountRepository,
  ILoadAccountByEmailRepository,
  ILoadAccountByTokenRepository,
  IUpdateAccessTokenRepository,
} from '@/data/protocols'

import { AccountModel } from '@/domain/models'
import { IAddAccountModel } from '@/domain/usecases'

export class AccountMongoRepository
  implements
    IAddAccountRepository,
    ILoadAccountByEmailRepository,
    IUpdateAccessTokenRepository,
    ILoadAccountByTokenRepository
{
  async add(account: IAddAccountModel): Promise<AccountModel> {
    const collection = await MongoClient.getCollection<AccountModel>('accounts')
    const { insertedId } = await collection.insertOne(account)
    const result = await collection.findOne({ _id: insertedId })
    return MongoClient.map<AccountModel>(result)
  }

  async loadByEmail(email: string): Promise<AccountModel> {
    const collection = await MongoClient.getCollection<AccountModel>('accounts')
    const account = await collection.findOne({ email })
    return MongoClient.map<AccountModel>(account)
  }

  async updateAccessToken(id: string, token: string): Promise<void> {
    const collection = await MongoClient.getCollection<AccountModel>('accounts')
    await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { accessToken: token } },
    )
  }

  async loadByToken(token: string, role?: string): Promise<AccountModel> {
    const collection = await MongoClient.getCollection<AccountModel>('accounts')
    const account = await collection.findOne({
      accessToken: token,
      $or: [{ role }, { role: 'admin' }],
    })
    return MongoClient.map<AccountModel>(account)
  }
}
