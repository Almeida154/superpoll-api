import jwt from 'jsonwebtoken'

import { IEncrypter, IDecrypter } from '@/data/protocols'

export class JwtAdapter implements IEncrypter, IDecrypter {
  constructor(private readonly secret: string) {}

  decrypt(): Promise<string> {
    throw new Error('Method not implemented.')
  }

  encrypt(value: string): Promise<string> {
    return new Promise((resolve) =>
      resolve(jwt.sign({ id: value }, this.secret)),
    )
  }
}
