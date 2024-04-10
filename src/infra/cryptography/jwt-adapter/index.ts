import jwt from 'jsonwebtoken'

import { IEncrypter } from '@/data/protocols'

export class JwtAdapter implements IEncrypter {
  private readonly secret: string

  constructor(secret: string) {
    this.secret = secret
  }

  encrypt(id: string): Promise<string> {
    jwt.sign({ id }, this.secret)
    return null
  }
}
