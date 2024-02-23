import { setup, teardown } from 'vitest-mongodb'
import { MongoClient as Client, Collection } from 'mongodb'

interface IConnectOptions {
  useMemory?: boolean
}

export const MongoClient = {
  client: null as Client,
  usingMemory: false,

  async connect(options?: IConnectOptions): Promise<void> {
    if (options?.useMemory) {
      return this.connectToMemoryServer()
    }

    this.client = await Client.connect(process.env.__MONGO_URI__)
  },

  async connectToMemoryServer(): Promise<void> {
    await setup()
    this.usingMemory = true
    this.client = await Client.connect(globalThis.__MONGO_URI__)
  },

  async disconnect(): Promise<void> {
    await this.client.close()
    if (this.usingMemory) teardown()
  },

  getCollection(name: string): Collection {
    return this.client.db().collection(name)
  },
}
