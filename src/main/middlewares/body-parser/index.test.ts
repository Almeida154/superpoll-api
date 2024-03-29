import { describe, it } from 'vitest'
import request from 'supertest'

import app from '@/main/config/app'

describe('Body Parser Middleware', () => {
  it('Should parses body as json', async () => {
    app.post('/test_body_parser', (req, res) => {
      res.send(req.body)
    })

    await request(app)
      .post('/test_body_parser')
      .send({ name: 'any_name' })
      .expect({ name: 'any_name' })
  })
})
