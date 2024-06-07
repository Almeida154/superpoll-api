import jwt from 'jsonwebtoken'

import { IEncrypter, IDecrypter } from '@/data/protocols'

export class JwtAdapter implements IEncrypter, IDecrypter {
  constructor(private readonly secret: string) {}

  async decrypt(token: string): Promise<string> {
    const decrypted = jwt.verify(token, this.secret)
    return decrypted as string
  }

  async encrypt(value: string): Promise<string> {
    const encrypted = jwt.sign({ id: value }, this.secret)
    return encrypted
  }
}
