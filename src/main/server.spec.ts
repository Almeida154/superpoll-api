import { describe, expect, it, vi } from 'vitest'
import { MongoClient } from '@/infra/db/mongodb/helpers/mongo-client'

describe('Server', () => {
  it('should call MongoClient connect method', async () => {
    const connectSpy = vi
      .spyOn(MongoClient, 'connect')
      .mockImplementationOnce(() => {
        return new Promise((resolve) => resolve())
      })

    await import('./server')

    expect(connectSpy).toHaveBeenCalledOnce()
  })
})
