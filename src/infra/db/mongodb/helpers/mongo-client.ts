import { setup, teardown } from 'vitest-mongodb'
import { MongoClient as Client, Collection } from 'mongodb'

interface IConnectOptions {
  useMemory?: boolean
  url?: string
}

type Result<T> = T & { _id?: string }

export const MongoClient = {
  client: null as Client,
  usingMemory: false,

  async connect(options?: IConnectOptions): Promise<void> {
    this.usingMemory = options?.useMemory

    return options?.useMemory
      ? this.connectToMemoryServer()
      : this.connectToServer(options?.url)
  },

  async connectToServer(url: string): Promise<void> {
    this.client = await Client.connect(url)
  },

  async connectToMemoryServer(): Promise<void> {
    await setup()
    this.client = await Client.connect(globalThis.__MONGO_URI__)
  },

  async disconnect(): Promise<void> {
    return this.usingMemory
      ? this.disconnectFromMemoryServer()
      : this.disconnectFromServer()
  },

  async disconnectFromServer() {
    await this.client.close()
  },

  async disconnectFromMemoryServer() {
    await teardown()
  },

  getCollection(name: string): Collection {
    return this.client.db().collection(name)
  },

  map<T>(resultItem: Partial<Result<T>>): T {
    const { _id, ...rest } = resultItem
    return { id: _id, ...rest } as T
  },
}
