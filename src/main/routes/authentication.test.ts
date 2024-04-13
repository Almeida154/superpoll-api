import { afterAll, beforeAll, beforeEach, describe, it } from 'vitest'
import request from 'supertest'
import { Collection } from 'mongodb'
import { hash } from 'bcrypt'

import app from '@/main/config/app'
import { MongoClient } from '@/infra/db/mongodb/helpers/mongo-client'

let collection: Collection

const makeFakeAccount = () => ({
  name: 'David',
  email: 'davidalmeida154of@gmail.com',
  password: '123',
})

describe('Authentication routes', () => {
  beforeAll(async () => {
    await new Promise<void>((resolve) => setTimeout(resolve, 100))
    await MongoClient.connect({ useMemory: true })
  })

  afterAll(async () => {
    await MongoClient.disconnect()
  })

  beforeEach(async () => {
    collection = await MongoClient.getCollection('accounts')
    await collection.deleteMany()
  })

  describe('POST /sign-up', () => {
    it('should return 200 on signs up', async () => {
      await request(app)
        .post('/api/sign-up')
        .send({ ...makeFakeAccount(), passwordConfirmation: '123' })
        .expect(200)
    })
  })

  describe('POST /sign-in', () => {
    it('should return 200 on signs up', async () => {
      const password = await hash('123', 12)
      await collection.insertOne({ ...makeFakeAccount(), password })

      await request(app)
        .post('/api/sign-in')
        .send({ email: 'davidalmeida154of@gmail.com', password: '123' })
        .expect(200)
    })

    it('should return 401 if user not found', async () => {
      await request(app)
        .post('/api/sign-in')
        .send({ email: 'davidalmeida154of@gmail.com', password: '123' })
        .expect(401)
    })
  })
})
