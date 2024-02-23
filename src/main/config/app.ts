import express from 'express'
import useMiddlewares from './use-middlewares'

const app = express()
useMiddlewares(app)

export default app
