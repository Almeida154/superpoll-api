import jwt from 'jsonwebtoken'

import { IEncrypter } from '@/data/protocols'

export class JwtAdapter implements IEncrypter {
  constructor(private readonly secret: string) {}

  encrypt(id: string): Promise<string> {
    return new Promise((resolve) => resolve(jwt.sign({ id }, this.secret)))
  }
}
