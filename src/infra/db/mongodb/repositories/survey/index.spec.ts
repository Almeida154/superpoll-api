import { Collection } from 'mongodb'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { IAddSurveyModel } from '@/domain/usecases/survey'
import { SurveyModel } from '@/domain/models'
import { MongoClient } from '../../helpers/mongo-client'

import { SurveyMongoRepository } from '.'

const makeFakeSurvey = (): IAddSurveyModel => ({
  answers: [
    { answer: 'any_answer', image: 'any_image' },
    { answer: 'another_answer' },
  ],
  question: 'any_question',
})

const makeSut = () => {
  return new SurveyMongoRepository()
}

let collection: Collection<Omit<SurveyModel, 'id'>>

describe('SurveyMongoRepository', () => {
  beforeAll(async () => {
    await MongoClient.connect({ useMemory: true })
  })

  afterAll(async () => {
    await MongoClient.disconnect()
  })

  beforeEach(async () => {
    collection = await MongoClient.getCollection('surveys')
    await collection.deleteMany()
  })

  it('should add a survey on success', async () => {
    const sut = makeSut()
    await sut.add(makeFakeSurvey())
    const survey = await collection.findOne({ question: 'any_question' })
    expect(survey).toBeTruthy()
  })
})
