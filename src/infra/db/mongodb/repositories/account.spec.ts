import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { MongoClient } from '@/infra/db/mongodb/helpers/mongo-client'

import { AccountMongoRepository } from './account'

const makeSUT = () => {
  return new AccountMongoRepository()
}

describe('Mongo Repository', () => {
  beforeAll(async () => {
    await MongoClient.connect({ useMemory: true })
  })

  afterAll(async () => {
    await MongoClient.disconnect()
  })

  it('Should returns an account on success', async () => {
    const sut = makeSUT()

    const account = await sut.add({
      name: 'any_name',
      email: 'any_email',
      password: 'hashed_password',
    })

    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe('any_name')
    expect(account.email).toBe('any_email')
    expect(account.password).toBe('hashed_password')
  })
})
