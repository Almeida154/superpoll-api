import { afterAll, beforeAll, beforeEach, describe, it } from 'vitest'
import request from 'supertest'
import { Collection } from 'mongodb'

import { MongoClient } from '@/infra/db/mongodb/helpers/mongo-client'
import { AccountModel, SurveyModel } from '@/domain/models'

import app from '@/main/config/app'
import { sign } from 'jsonwebtoken'
import env from '@/main/config/env'

let surveyCollection: Collection<Omit<SurveyModel, 'id'>>
let accountCollection: Collection<Omit<AccountModel, 'id'>>

describe('Survey routes', () => {
  beforeAll(async () => {
    await new Promise<void>((resolve) => setTimeout(resolve, 100))
    await MongoClient.connect({ useMemory: true })
  })

  afterAll(async () => {
    await MongoClient.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = await MongoClient.getCollection('surveys')
    accountCollection = await MongoClient.getCollection('accounts')

    await surveyCollection.deleteMany()
    await accountCollection.deleteMany()
  })

  describe('POST /add-survey', () => {
    it('should return 403 on add survey without access token', async () => {
      await request(app)
        .post('/api/add-survey')
        .send({
          question: 'Question',
          answers: [
            {
              answer: 'Answer 1',
              image: 'http://image-name.com',
            },
            {
              answer: 'Answer 2',
            },
          ],
        })
        .expect(403)
    })

    it('should return 204 on add survey with valid access token', async () => {
      const account = await accountCollection.insertOne({
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: '123456',
        role: 'admin',
      })

      const accessToken = sign({ id: account.insertedId }, env.jwtSecret)

      await accountCollection.updateOne(
        { _id: account.insertedId },
        { $set: { accessToken } },
      )

      await request(app)
        .post('/api/add-survey')
        .set('x-access-token', accessToken)
        .send({
          question: 'Question',
          answers: [
            {
              answer: 'Answer 1',
              image: 'http://image-name.com',
            },
            {
              answer: 'Answer 2',
            },
          ],
        })
        .expect(204)
    })
  })
})
