import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { Collection } from 'mongodb'

import { LogMongoRepository } from '.'

import { MongoClient } from '../../helpers/mongo-client'

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

  it('Should create an error log on success', async () => {
    const sut = new LogMongoRepository()
    await sut.logError('any_sack')
    const count = await collection.countDocuments()
    expect(count).toBe(1)
  })
})
