import bcrypt from 'bcrypt'

import { IHashComparer, IHashMaker } from '@/data/protocols'

export class BcryptAdapter implements IHashMaker, IHashComparer {
  constructor(private readonly salt: number) {}

  async hash(value: string): Promise<string> {
    return await bcrypt.hash(value, this.salt)
  }

  async compare(value: string, hash: string): Promise<boolean> {
    const isValid = await bcrypt.compare(value, hash)
    return isValid
  }
}
