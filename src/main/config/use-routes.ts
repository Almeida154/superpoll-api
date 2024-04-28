import { Express, Router } from 'express'
import { readdirSync } from 'fs'
import path from 'path'

export default async (app: Express): Promise<void> => {
  const router = Router()
  app.use('/api', router)

  const routesPath = path.join(__dirname, '..', 'routes')

  readdirSync(routesPath).map(async (folder) => {
    const folderPath = `${routesPath}/${folder}`

    readdirSync(folderPath).map(async (file) => {
      const isTest = file.includes('.test.')
      const isSourceMap = file.includes('.map')

      if (!isTest && !isSourceMap) {
        const route = await import(path.join(folderPath, file))
        route.default(router)
      }
    })
  })
}
