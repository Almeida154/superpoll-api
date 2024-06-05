import { describe, expect, it, vi } from 'vitest'
import { IDecrypter } from '@/data/protocols/cryptography/decrypter'
import { LoadAccountByTokenUseCase } from '.'

const makeDecrypterStub = () => {
  class DecrypterStub implements IDecrypter {
    decrypt(): Promise<string> {
      return new Promise((resolve) => resolve('decrypted_value'))
    }
  }

  return new DecrypterStub()
}

interface ISut {
  sut: LoadAccountByTokenUseCase
  decrypterStub: IDecrypter
}

const makeSut = (): ISut => {
  const decrypterStub = makeDecrypterStub()
  const sut = new LoadAccountByTokenUseCase(decrypterStub)

  return {
    sut,
    decrypterStub,
  }
}

describe('LoadAccountByTokenUseCase', () => {
  it('should call Decrypter with correct values', async () => {
    const { sut, decrypterStub } = makeSut()
    const decryptSpy = vi.spyOn(decrypterStub, 'decrypt')
    await sut.execute('any_token')
    expect(decryptSpy).toHaveBeenCalledWith('any_token')
  })
})
