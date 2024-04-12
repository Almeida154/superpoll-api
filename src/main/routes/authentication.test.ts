import { afterAll, beforeAll, beforeEach, describe, it } from 'vitest'
import request from 'supertest'

import app from '@/main/config/app'
import { MongoClient } from '@/infra/db/mongodb/helpers/mongo-client'

describe('Authentication routes', () => {
  beforeAll(async () => {
    await MongoClient.connect({ useMemory: true })
  })

  afterAll(async () => {
    await MongoClient.disconnect()
  })

  beforeEach(async () => {
    const collection = await MongoClient.getCollection('accounts')
    await collection.deleteMany()
  })

  describe('POST /sign-up', () => {
    it('should return 200 on signs up', async () => {
      await request(app)
        .post('/api/sign-up')
        .send({
          name: 'David',
          email: 'davidalmeida154of@gmail.com',
          password: '123',
          passwordConfirmation: '123',
        })
        .expect(200)
    })
  })
})
