import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { Collection } from 'mongodb'

import { MongoClient } from '../../helpers/mongo-client'

import { LogMongoRepository } from '.'

const makeSut = () => {
  return new LogMongoRepository()
}

describe('LogMongoRepository', () => {
  let collection: Collection

  beforeAll(async () => {
    await MongoClient.connect({ useMemory: true })
  })

  afterAll(async () => {
    await MongoClient.disconnect()
  })

  beforeEach(async () => {
    collection = await MongoClient.getCollection('errors')
    await collection.deleteMany()
  })

  it('should create an error log on success', async () => {
    const sut = makeSut()
    await sut.logError('any_sack')
    const count = await collection.countDocuments()
    expect(count).toBe(1)
  })
})
