import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { Collection } from 'mongodb'

import { MongoClient } from '@/infra/db/mongodb/helpers/mongo-client'
import { IAddAccountModel } from '@/domain/usecases'

import { AccountMongoRepository } from '.'

const makeFakeAccount = (): IAddAccountModel => ({
  name: 'any_name',
  email: 'any@email.com',
  password: 'hashed_password',
})

const makeSut = () => {
  return new AccountMongoRepository()
}

let collection: Collection

describe('AccountMongoRepository', () => {
  beforeAll(async () => {
    await MongoClient.connect({ useMemory: true })
  })

  afterAll(async () => {
    await MongoClient.disconnect()
  })

  beforeEach(async () => {
    collection = await MongoClient.getCollection('accounts')
    await collection.deleteMany()
  })

  describe('add()', () => {
    it('should return an account on add success', async () => {
      const sut = makeSut()
      const account = await sut.add(makeFakeAccount())
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe('any_name')
      expect(account.email).toBe('any@email.com')
      expect(account.password).toBe('hashed_password')
    })
  })

  describe('loadByEmail()', () => {
    it('should return an account on loadByEmail success', async () => {
      const sut = makeSut()
      await collection.insertOne(makeFakeAccount())
      const account = await sut.loadByEmail('any@email.com')
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe('any_name')
      expect(account.email).toBe('any@email.com')
      expect(account.password).toBe('hashed_password')
    })

    it('should return null if loadByEmail fails', async () => {
      const sut = makeSut()
      const account = await sut.loadByEmail('any@email.com')
      expect(account).toBeFalsy()
    })
  })

  describe('updateAccessToken()', () => {
    it('should update account accessToken on updateAccessToken success', async () => {
      const sut = makeSut()
      let account = await sut.add(makeFakeAccount())
      expect(account).not.toHaveProperty('accessToken')
      await sut.updateAccessToken(account.id, 'any_token')
      account = await sut.loadByEmail(account.email)
      expect(account).toBeTruthy()
      expect(account.accessToken).toBe('any_token')
    })
  })

  describe('loadByToken()', () => {
    it('should return an account on loadByToken without role', async () => {
      const sut = makeSut()
      await collection.insertOne({
        ...makeFakeAccount(),
        accessToken: 'any_token',
      })
      const account = await sut.loadByToken('any_token')
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe('any_name')
      expect(account.email).toBe('any@email.com')
      expect(account.password).toBe('hashed_password')
    })
  })
})
