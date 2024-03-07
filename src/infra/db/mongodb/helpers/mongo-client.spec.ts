import { afterAll, describe, expect, it, vi } from 'vitest'
import { MongoClient } from 'mongodb'
import { MongoClient as sut } from './mongo-client'

describe('Mongo Client Helper', () => {
  afterAll(async () => {
    await sut.disconnect()
  })

  it('Should connects to memory server if useMemory prop is true', async () => {
    const connectToMemoryServerSpy = vi.spyOn(sut, 'connectToMemoryServer')

    await sut.connect({ useMemory: true })

    expect(connectToMemoryServerSpy).toHaveBeenCalled()
  })

  it('Should connects to mongo server if a valid url is provided', async () => {
    vi.spyOn(MongoClient, 'connect').mockImplementationOnce(async () => {
      return new Promise((resolve) => resolve(null))
    })

    const connectToServerSpy = vi.spyOn(sut, 'connectToServer')

    await sut.connect({ url: 'valid_url' })

    expect(connectToServerSpy).toHaveBeenCalledWith('valid_url')
    expect(MongoClient.connect).toHaveBeenCalledWith('valid_url')
  })

  it('Should disconnects from memory server when disconnects', async () => {
    const disconnectFromMemoryServerSpy = vi.spyOn(
      sut,
      'disconnectFromMemoryServer',
    )

    await sut.connect({ useMemory: true })
    await sut.disconnect()

    expect(disconnectFromMemoryServerSpy).toHaveBeenCalled()
  })

  it('Should disconnects from mongo server when disconnects', async () => {
    vi.spyOn(MongoClient, 'connect').mockImplementationOnce(async () => {
      return new Promise((resolve) => resolve(null))
    })

    const disconnectFromServerSpy = vi.spyOn(sut, 'disconnectFromServer')

    await sut.connect({ url: 'valid_url' })

    sut.client = {
      close: () => new Promise((resolve) => resolve()),
    } as MongoClient

    await sut.disconnect()

    expect(disconnectFromServerSpy).toHaveBeenCalled()
  })

  it('Should reconnects if mongodb is down', async () => {
    await sut.connect({ useMemory: true })

    let collection = await sut.getCollection('accounts')
    expect(collection).toBeTruthy()

    await sut.disconnect()

    collection = await sut.getCollection('accounts')
    expect(collection).toBeTruthy()
  })
})
