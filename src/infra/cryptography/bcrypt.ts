import bcrypt from 'bcrypt'

import { IHashMaker } from '@/data/protocols'

export class BcryptAdapter implements IHashMaker {
  private readonly salt: number

  constructor(salt: number) {
    this.salt = salt
  }

  async hash(value: string): Promise<string> {
    return await bcrypt.hash(value, this.salt)
  }
}
