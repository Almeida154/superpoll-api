import express from 'express'
import useMiddlewares from './use-middlewares'
import useRoutes from './use-routes'

const app = express()

useMiddlewares(app)
useRoutes(app)

export default app
