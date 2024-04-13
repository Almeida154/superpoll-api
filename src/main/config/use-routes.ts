import { Express, Router } from 'express'
import { readdirSync } from 'fs'
import path from 'path'

export default async (app: Express): Promise<void> => {
  const router = Router()
  app.use('/api', router)

  const routesPath = path.join(__dirname, '..', 'routes')

  readdirSync(routesPath).map(async (file) => {
    if (!file.includes('.test.')) {
      const route = await import(path.join(routesPath, file))
      route.default(router)
    }
  })
}
