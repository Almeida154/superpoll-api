import { Router } from 'express'

import { makeAddSurveyController } from '../../factories'
import { adaptRoute } from '../../adapters'
import { makeAuthMiddleware } from '@/main/factories/middlewares/auth'
import { adaptMiddleware } from '@/main/adapters/adapt-middleware'

export default (router: Router): void => {
  const adminAuth = adaptMiddleware(makeAuthMiddleware('admin'))
  router.post('/add-survey', adminAuth, adaptRoute(makeAddSurveyController()))
}
