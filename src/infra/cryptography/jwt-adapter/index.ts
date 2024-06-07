import jwt from 'jsonwebtoken'

import { IEncrypter, IDecrypter } from '@/data/protocols'

export class JwtAdapter implements IEncrypter, IDecrypter {
  constructor(private readonly secret: string) {}

  decrypt(value: string): Promise<string> {
    jwt.verify(value, this.secret)
    return null
  }

  encrypt(value: string): Promise<string> {
    return new Promise((resolve) =>
      resolve(jwt.sign({ id: value }, this.secret)),
    )
  }
}
