import { afterAll, beforeAll, beforeEach, describe, it } from 'vitest'
import request from 'supertest'

import app from '@/main/config/app'
import { MongoClient } from '@/infra/db/mongodb/helpers/mongo-client'

describe('SignUp Routes', () => {
  beforeAll(async () => {
    await MongoClient.connect({ useMemory: true })
  })

  afterAll(async () => {
    await MongoClient.disconnect()
  })

  beforeEach(async () => {
    const collection = MongoClient.getCollection('accounts')
    await collection.deleteMany()
  })

  it('Should returns an account on success', async () => {
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
