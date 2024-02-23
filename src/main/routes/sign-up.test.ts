import { describe, it } from 'vitest'
import request from 'supertest'

import app from '@/main/config/app'

describe('SignUp Routes', () => {
  it('Should returns an account on success', async () => {
    await request(app)
      .post('/api/sign-up')
      .send({
        name: 'David',
        email: 'davidalmeida154of@gmail.com',
        password: '123',
        passwordConfirmation: '123',
      })
      .expect(200)
  })
})
