import { afterAll, beforeAll, beforeEach, describe, it } from 'vitest'
import request from 'supertest'
import { Collection } from 'mongodb'

import { MongoClient } from '@/infra/db/mongodb/helpers/mongo-client'
import { SurveyModel } from '@/domain/models'

import app from '@/main/config/app'

let collection: Collection<Omit<SurveyModel, 'id'>>

describe('Survey routes', () => {
  beforeAll(async () => {
    await new Promise<void>((resolve) => setTimeout(resolve, 100))
    await MongoClient.connect({ useMemory: true })
  })

  afterAll(async () => {
    await MongoClient.disconnect()
  })

  beforeEach(async () => {
    collection = await MongoClient.getCollection('surveys')
    await collection.deleteMany()
  })

  describe('POST /add-survey', () => {
    it('should return 200 on add survey success', async () => {
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
        .expect(204)
    })
  })
})
