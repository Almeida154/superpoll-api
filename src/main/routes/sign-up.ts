import { Router } from 'express'

export default (router: Router): void => {
  router.post('/sign-up', (req, res) => {
    return res.json({ ok: 'ok' })
  })
}
