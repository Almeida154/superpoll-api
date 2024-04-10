import bcrypt from 'bcrypt'

import { IHashComparer, IHashMaker } from '@/data/protocols'

export class BcryptAdapter implements IHashMaker, IHashComparer {
  private readonly salt: number

  constructor(salt: number) {
    this.salt = salt
  }

  async hash(value: string): Promise<string> {
    return await bcrypt.hash(value, this.salt)
  }

  async compare(value: string, hash: string): Promise<boolean> {
    await bcrypt.compare(value, hash)
    return new Promise((resolve) => resolve(true))
  }
}
