import { Router } from 'express'

import { makeSignUpController, makeSignInController } from '../factories'
import { adaptRoute } from '../adapters'

export default (router: Router): void => {
  router.post('/sign-up', adaptRoute(makeSignUpController()))
  router.post('/sign-in', adaptRoute(makeSignInController()))
}
