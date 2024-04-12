import { createServer } from 'http'
import { beforeAll, describe, expect, it, MockInstance, vi } from 'vitest'
import { MongoClient } from '@/infra/db/mongodb/helpers/mongo-client'
import app from './config/app'
import env from './config/env'

vi.mock('./server')
vi.mock('./config/app')
vi.mock('@/infra/db/mongodb/helpers/mongo-client')

describe('Server', () => {
  let connectSpy: MockInstance
  let listenSpy: MockInstance
  let consoleLogSpy: MockInstance

  beforeAll(async () => {
    consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => null)

    connectSpy = vi
      .spyOn(MongoClient, 'connect')
      .mockImplementationOnce(() => new Promise((resolve) => resolve()))

    listenSpy = vi.spyOn(app, 'listen').mockImplementation((_, cb) => {
      cb()
      return createServer()
    })
  })

  it('should call MongoClient connect method', async () => {
    await import('./server')
    expect(connectSpy).toHaveBeenCalledOnce()
  })

  it('should call app listen with correct env', async () => {
    await import('./server')
    expect(listenSpy).toHaveBeenCalledWith(env.port, expect.anything())
    expect(consoleLogSpy).toHaveBeenCalled()
  })

  it('should handle MongoDB connection error', async () => {
    connectSpy = vi
      .spyOn(MongoClient, 'connect')
      .mockImplementationOnce(
        () => new Promise((_resolve, reject) => reject(new Error())),
      )
    import('./server')
    await expect(connectSpy).rejects.toThrow()
  })
})
