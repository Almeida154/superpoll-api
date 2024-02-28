import { beforeEach, describe, expect, it, vi } from 'vitest'
import { MongoClient as Client } from 'mongodb'

vi.mock('mongodb')

describe('Mongo Client Helper', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('Should calls connectToMemoryServer if using memory mongo server', async () => {
    const { MongoClient: sut } = await import('./mongo-client')

    const connectToMemoryServerSpy = vi.spyOn(sut, 'connectToMemoryServer')

    await sut.connect({ useMemory: true })

    expect(connectToMemoryServerSpy).toHaveBeenCalled()
  })

  it('Should calls connectToServer if no memory server needed', async () => {
    const { MongoClient: sut } = await import('./mongo-client')

    const connectToServerSpy = vi.spyOn(sut, 'connectToServer')

    await sut.connect({ url: 'valid_url' })

    expect(connectToServerSpy).toHaveBeenCalledWith('valid_url')
  })

  it('Should connects to server using provided URL', async () => {
    const { MongoClient: sut } = await import('./mongo-client')

    await sut.connect({ url: 'valid_url' })

    expect(Client.connect).toHaveBeenCalledWith('valid_url')
  })

  it('Should teardowns client server when disconnects from memory mongo server', async () => {
    const { MongoClient: sut } = await import('./mongo-client')

    const disconnectFromMemoryServerSpy = vi.spyOn(
      sut,
      'disconnectFromMemoryServer',
    )

    await sut.connect({ useMemory: true })
    await sut.disconnect()

    expect(disconnectFromMemoryServerSpy).toHaveBeenCalled()
  })

  it('Should teardowns client server when disconnects from memory mongo server', async () => {
    const { MongoClient: sut } = await import('./mongo-client')

    const disconnectFromServerSpy = vi.spyOn(sut, 'disconnectFromServer')

    await sut.connect({ url: 'valid_url' })

    sut.client = {
      close: () => new Promise((resolve) => resolve()),
    } as Client

    await sut.disconnect()

    expect(disconnectFromServerSpy).toHaveBeenCalled()
  })
})
