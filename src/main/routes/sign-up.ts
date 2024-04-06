import { Router } from 'express'

import { makeSignUpController } from '../factories/'
import { adaptRoute } from '../adapters'

export default (router: Router): void => {
  router.post('/sign-up', adaptRoute(makeSignUpController()))
}
