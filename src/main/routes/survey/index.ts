import { Router } from 'express'

import { makeAddSurveyController } from '../../factories'
import { adaptRoute } from '../../adapters'

export default (router: Router): void => {
  router.post('/add-survey', adaptRoute(makeAddSurveyController()))
}
